import { getSecureEndpoint, sanitizeCyberInput, maskSensitiveEmail } from './cyberSecurity';
import type { Application, TrackingResult, ApplicationStatus } from '../types/tracking';

/**
 * Validate Application ID format:
 * Accepts ASTRA-2026-TEAM001, ASTRA-2026-TEAM002, or any ASTRA-2026-[A-Z0-9_-]+
 */
export function validateApplicationId(rawId: string): { isValid: boolean; error?: string } {
  const trimmed = rawId.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter your Application ID.'
    };
  }

  // Format validation: ASTRA-2026-TEAM001, ASTRA-2026-XXXX, etc.
  const regex = /^ASTRA(-2026)?-[A-Z0-9_-]{3,30}$/i;
  if (!regex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid Application ID, for example ASTRA-2026-TEAM001.'
    };
  }

  return { isValid: true };
}

/**
 * Query live Google Apps Script Web App API
 */
export async function trackApplication(rawApplicationId: string): Promise<TrackingResult> {
  const validation = validateApplicationId(rawApplicationId);
  if (!validation.isValid) {
    return {
      success: false,
      errorCode: !rawApplicationId.trim() ? 'EMPTY_INPUT' : 'INVALID_FORMAT',
      error: validation.error
    };
  }

  const applicationId = sanitizeCyberInput(rawApplicationId);
  const endpointUrl = getSecureEndpoint();

  try {
    const queryUrl = `${endpointUrl}?applicationId=${encodeURIComponent(applicationId)}`;
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        errorCode: 'NETWORK_ERROR',
        error: 'Unable to connect to the application tracking service. Please try again later.'
      };
    }

    const responseText = await response.text();

    try {
      const result = JSON.parse(responseText);

      // Handle Format 1: { success: true, application: { ... } }
      // or Format 2: { success: true, data: { ... } }
      const rawApp = result.application || result.data;

      if (result.success && rawApp) {
        // Parse members whether array of objects { name: string } or strings
        const rawMembers = rawApp.members;
        const normalizedMembers: Array<{ name: string } | string> = Array.isArray(rawMembers)
          ? rawMembers
          : [];

        const app: Application = {
          applicationId: rawApp.applicationId || applicationId,
          teamId: rawApp.teamId || rawApp.teamName || 'ASTRA-TEAM',
          teamName: rawApp.teamName || 'ASTRA Team',
          teamLead: rawApp.teamLead || rawApp.name || 'Team Leader',
          email: maskSensitiveEmail(rawApp.email || ''),
          college: rawApp.college || 'NRI Institute of Technology',
          branch: rawApp.branch || 'CSE',
          track: rawApp.track || 'General Innovation',
          members: normalizedMembers,
          memberCount: rawApp.memberCount || (Array.isArray(normalizedMembers) ? normalizedMembers.length : 4),
          status: (rawApp.status?.toUpperCase() as ApplicationStatus) || 'SUBMITTED',
          lastUpdated: rawApp.lastUpdated || new Date().toISOString(),
          reviewNotes: rawApp.reviewNotes
        };

        return {
          success: true,
          application: app,
          data: app
        };
      }

      // If API returned { success: false, message: "..." }
      if (result.success === false) {
        const errorMsg = result.message || result.error || 'Application not found. Please check your Application ID and try again.';
        return {
          success: false,
          errorCode: 'NOT_FOUND',
          error: errorMsg,
          message: errorMsg
        };
      }
    } catch {
      return {
        success: false,
        errorCode: 'NETWORK_ERROR',
        error: 'Unable to connect to the application tracking service. Please try again later.'
      };
    }
  } catch {
    return {
      success: false,
      errorCode: 'NETWORK_ERROR',
      error: 'Unable to connect to the application tracking service. Please try again later.'
    };
  }

  return {
    success: false,
    errorCode: 'NOT_FOUND',
    error: 'Application not found. Please check your Application ID and try again.'
  };
}
