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
}

interface ApiResponse {
  success: boolean;
  message?: string;
  errorCode?: string;
  application?: ApplicationData;
  data?: ApplicationData;
}

export function validateApplicationId(rawId: string): { isValid: boolean; error?: string } {
  const trimmed = (rawId || "").trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: "Please enter your Application ID."
    };
  }

  const normalized = trimmed.toUpperCase();
  if (!/^ASTRA-2026-TEAM\d{3,}$/.test(normalized)) {
    return {
      isValid: false,
      error: "Invalid Application ID. Example: ASTRA-2026-TEAM001"
    };
  }

  return { isValid: true };
}

export async function trackApplication(
  applicationId: string
): Promise<ApplicationData> {
  if (!API_URL) {
    throw new Error(
      "Application tracking service is not configured."
    );
  }

  const normalizedId =
    applicationId
      .trim()
      .toUpperCase();

  if (!normalizedId) {
    throw new Error(
      "Please enter your Application ID."
    );
  }

  if (
    !/^ASTRA-2026-TEAM\d{3,}$/.test(
      normalizedId
    )
  ) {
    throw new Error(
      "Invalid Application ID. Example: ASTRA-2026-TEAM001"
    );
  }

  const url =
    `${API_URL}?applicationId=${encodeURIComponent(
      normalizedId
    )}`;

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
      "Unable to connect to application tracking service."
    );
  }

  if (!response.ok) {
    throw new Error(
      "Unable to connect to application tracking service."
    );
  }

  let data: ApiResponse;
  try {
    data = (await response.json()) as ApiResponse;
  } catch {
    throw new Error(
      "Unable to connect to application tracking service."
    );
  }

  if (!data.success) {
    if (data.errorCode === "NOT_FOUND") {
      throw new Error(
        "Application not found. Please check your Application ID and try again."
      );
    }
    if (data.errorCode === "INVALID_FORMAT") {
      throw new Error(
        "Invalid Application ID. Example: ASTRA-2026-TEAM001"
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

  const rawApp = data.application || data.data;

  if (!rawApp) {
    throw new Error(
      "Application data was not returned."
    );
  }

  const rawMembers = rawApp.members;
  const normalizedMembers: TeamMember[] = Array.isArray(rawMembers)
    ? rawMembers.map((m: any, idx: number) => {
        if (typeof m === "string") {
          return { name: m, role: idx === 0 ? "Team Lead" : `Team Member ${idx}` };
        }
        return {
          name: m?.name || String(m || ""),
          role: m?.role || (idx === 0 ? "Team Lead" : `Team Member ${idx}`)
        };
      })
    : [];

  const application: ApplicationData = {
    applicationId: rawApp.applicationId || normalizedId,
    teamId: rawApp.teamId || "",
    teamName: rawApp.teamName || "",
    teamLead: rawApp.teamLead || "",
    email: rawApp.maskedEmail || rawApp.email || "",
    maskedEmail: rawApp.maskedEmail || rawApp.email || "",
    branch: rawApp.branch || "",
    problemStatement: rawApp.problemStatement || "",
    domain: rawApp.domain || "",
    track: rawApp.domain || rawApp.track || "",
    college: rawApp.college,
    members: normalizedMembers,
    memberCount: rawApp.memberCount || normalizedMembers.length,
    status: rawApp.status ? String(rawApp.status).toUpperCase() : "SUBMITTED",
    lastUpdated: rawApp.lastUpdated || "",
    reviewNotes: rawApp.reviewNotes
  };

  return application;
}
