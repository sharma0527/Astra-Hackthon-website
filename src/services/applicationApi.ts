const DEFAULT_API_URL =
  "https://script.google.com/macros/s/AKfycbwSYrFJKNLTxIvgHGD-d12ztyzm-__IMUt4VJ53ioTZo3YxOs2-UJs4GyRZbgqaMa7n/exec";

const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

export interface TeamMember {
  name: string;
  role: string;
}

export interface ApplicationData {
  applicationId: string;
  teamId: string;
  teamName: string;
  teamLead: string;
  email: string;
  maskedEmail?: string;
  branch: string;
  problemStatement: string;
  domain: string;
  members: TeamMember[];
  memberCount: number;
  status: string;
  lastUpdated: string;
  reviewNotes?: string;
  college?: string;
  track?: string;
  usage?: number | string;
  limit?: number | string;
  remaining?: number | string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  errorCode?: string;
  limitReached?: boolean;
  application?: ApplicationData;
  data?: ApplicationData;
  usage?: number | string;
  limit?: number | string;
  remaining?: number | string;
}

export function validateApplicationId(rawId: string): { isValid: boolean; error?: string; normalizedId: string } {
  const trimmed = (rawId || "").trim().replace(/\s+/g, "");
  if (!trimmed) {
    return {
      isValid: false,
      error: "Please enter your Application ID.",
      normalizedId: ""
    };
  }

  const normalized = trimmed.toUpperCase();
  // Valid formats supported:
  // - Unpredictable UUID: ASTRA-2026-7F3A91C4D8E24607A91C5D8E3F2B617C (32 hex chars)
  // - Legacy / Sequential: ASTRA-2026-TEAM001 or ASTRA-TEAM-001
  // - Lenient prefix matching: Any ASTRA-* identifier
  const isValidFormat = /^ASTRA(-[A-Z0-9_-]+)+$/i.test(normalized);
  if (!isValidFormat) {
    return {
      isValid: false,
      error: "Invalid Application ID. Example: ASTRA-2026-7F3A91... or ASTRA-2026-TEAM001",
      normalizedId: normalized
    };
  }

  return { isValid: true, normalizedId: normalized };
}

export async function trackApplication(
  applicationId: string
): Promise<ApplicationData> {
  const validation = validateApplicationId(applicationId);
  if (!validation.isValid) {
    throw new Error(validation.error || "Please enter a valid Application ID.");
  }

  const normalizedId = validation.normalizedId;
  const endpoint = API_URL || DEFAULT_API_URL;
  const url = `${endpoint}?applicationId=${encodeURIComponent(normalizedId)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });
  } catch {
    throw new Error(
      "Unable to connect to application tracking service. Please check your internet connection."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Unable to connect to application tracking service (${response.status}).`
    );
  }

  let data: ApiResponse;
  try {
    data = (await response.json()) as ApiResponse;
  } catch {
    throw new Error(
      "Unable to parse response from application tracking service."
    );
  }

  if (!data.success) {
    if (data.limitReached || (data.message && data.message.toLowerCase().includes("limit reached"))) {
      throw new Error(
        "LIMIT_REACHED:Tracking limit reached. Please contact the ASTRA Hackathon Team for assistance."
      );
    }
    if (data.errorCode === "NOT_FOUND" || (data.message && data.message.toLowerCase().includes("not found"))) {
      throw new Error(
        "Application not found. Please check your Application ID and try again."
      );
    }
    if (data.errorCode === "INVALID_FORMAT") {
      throw new Error(
        "Invalid Application ID. Please check and enter your valid ASTRA Application ID."
      );
    }
    if (data.errorCode === "MISSING_ID") {
      throw new Error(
        "Please enter your Application ID."
      );
    }
    throw new Error(
      data.message || "Application not found. Please check your Application ID and try again."
    );
  }

  const rawApp = (data.data || data.application || {}) as any;

  if (!rawApp || Object.keys(rawApp).length === 0) {
    throw new Error(
      "Application data was not returned."
    );
  }

  const rawMembers = rawApp.members;
  let normalizedMembers: TeamMember[] = [];
  if (Array.isArray(rawMembers) && rawMembers.length > 0) {
    normalizedMembers = rawMembers.map((m: any, idx: number) => {
      if (typeof m === "string") {
        return { name: m, role: idx === 0 ? "Team Lead" : `Team Member ${idx}` };
      }
      return {
        name: m?.name || String(m || ""),
        role: m?.role || (idx === 0 ? "Team Lead" : `Team Member ${idx}`)
      };
    });
  } else if (rawApp.teamLead) {
    normalizedMembers = [{ name: rawApp.teamLead, role: "Team Lead" }];
  }

  const application: ApplicationData = {
    applicationId: rawApp.applicationId || normalizedId,
    teamId: rawApp.teamId || "N/A",
    teamName: rawApp.teamName || "N/A",
    teamLead: rawApp.teamLead || "N/A",
    email: rawApp.maskedEmail || rawApp.email || "N/A",
    maskedEmail: rawApp.maskedEmail || rawApp.email || "N/A",
    branch: rawApp.branch || "N/A",
    problemStatement: rawApp.problemStatement || "N/A",
    domain: rawApp.domain || rawApp.track || "N/A",
    track: rawApp.domain || rawApp.track || "N/A",
    college: rawApp.college,
    members: normalizedMembers,
    memberCount: rawApp.memberCount || normalizedMembers.length || 1,
    status: rawApp.status ? String(rawApp.status).toUpperCase() : "SUBMITTED",
    lastUpdated: rawApp.lastUpdated || "",
    reviewNotes: rawApp.reviewNotes,
    usage: data.usage ?? rawApp.usage,
    limit: data.limit ?? rawApp.limit,
    remaining: data.remaining ?? rawApp.remaining
  };

  return application;
}

