import { getSecureEndpoint, maskSensitiveEmail } from './cyberSecurity';
import type { Application, TrackingResult, ApplicationResponse, TeamMember, ApplicationStatus } from '../types/tracking';

/**
 * Normalizes Application ID input
 */
export function normalizeApplicationId(rawId: string): string {
  return (rawId || '').trim().toUpperCase();
}

/**
 * Validate Application ID format:
 * Accepts ASTRA-2026-TEAM001, ASTRA-2026-TEAM002, etc. (at least 3 digits)
 */
export function validateApplicationId(rawId: string): { isValid: boolean; error?: string } {
  const trimmed = (rawId || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter your Application ID.'
    };
  }

  const normalized = trimmed.toUpperCase();
  const regex = /^ASTRA-2026-TEAM\d{3,}$/;
  if (!regex.test(normalized)) {
    return {
      isValid: false,
      error: 'Please enter a valid Application ID, for example ASTRA-2026-TEAM001.'
    };
  }

  return { isValid: true };
}

/**
 * Query live Google Apps Script Web App API
 * No mock data. Supports response.application and response.data.
 */
export async function trackApplication(rawApplicationId: string): Promise<TrackingResult> {
  const trimmed = (rawApplicationId || '').trim();
  if (!trimmed) {
    return {
      success: false,
      errorCode: 'MISSING_ID',
      error: 'Please enter your Application ID.',
      message: 'Please enter your Application ID.'
    };
  }

  const normalizedId = trimmed.toUpperCase();
  const validation = validateApplicationId(normalizedId);
  if (!validation.isValid) {
    return {
      success: false,
      errorCode: 'INVALID_FORMAT',
      error: validation.error,
      message: validation.error
    };
  }

  const apiUrl = getSecureEndpoint();

  try {
    const queryUrl = `${apiUrl}?applicationId=${encodeURIComponent(normalizedId)}`;
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        errorCode: 'SERVER_ERROR',
        error: 'Unable to connect to the application tracking service. Please try again later.',
        message: 'Unable to connect to the application tracking service. Please try again later.'
      };
    }

    const result: ApplicationResponse = await response.json();

    // Support both response.application and response.data
    const rawApp = result.application || result.data;

    if (result.success && rawApp) {
      const rawMembers = rawApp.members;
      const normalizedMembers: TeamMember[] = Array.isArray(rawMembers)
        ? rawMembers.map((m: any) => {
            if (typeof m === 'string') {
              return { name: m, role: 'Team Member' };
            }
            return {
              name: m?.name || String(m || ''),
              role: m?.role || 'Team Member'
            };
          })
        : [];

      const app: Application = {
        applicationId: rawApp.applicationId || normalizedId,
        teamId: rawApp.teamId || '',
        teamName: rawApp.teamName || '',
        teamLead: rawApp.teamLead || '',
        email: rawApp.maskedEmail || maskSensitiveEmail(rawApp.email || ''),
        maskedEmail: rawApp.maskedEmail || maskSensitiveEmail(rawApp.email || ''),
        branch: rawApp.branch || '',
        problemStatement: rawApp.problemStatement || '',
        domain: rawApp.domain || '',
        track: rawApp.domain || rawApp.problemStatement || rawApp.track || '',
        college: rawApp.college,
        members: normalizedMembers,
        memberCount: rawApp.memberCount || normalizedMembers.length,
        status: (rawApp.status ? String(rawApp.status).toUpperCase() : 'SUBMITTED') as ApplicationStatus,
        lastUpdated: rawApp.lastUpdated,
        reviewNotes: rawApp.reviewNotes
      };

      return {
        success: true,
        application: app,
        data: app
      };
    }

    if (result.success === false) {
      if (result.errorCode === 'INVALID_FORMAT') {
        return {
          success: false,
          errorCode: 'INVALID_FORMAT',
          error: 'Please enter a valid Application ID, for example ASTRA-2026-TEAM001.',
          message: 'Please enter a valid Application ID, for example ASTRA-2026-TEAM001.'
        };
      }
      if (result.errorCode === 'NOT_FOUND') {
        return {
          success: false,
          errorCode: 'NOT_FOUND',
          error: 'Application not found. Please check your Application ID and try again.',
          message: 'Application not found. Please check your Application ID and try again.'
        };
      }
      if (result.errorCode === 'SHEET_NOT_FOUND' || result.errorCode === 'NO_SPREADSHEET' || result.errorCode === 'APPLICATION_COLUMN_MISSING' || result.errorCode === 'SERVER_ERROR') {
        return {
          success: false,
          errorCode: 'SERVER_ERROR',
          error: 'Unable to connect to the application tracking service. Please try again later.',
          message: 'Unable to connect to the application tracking service. Please try again later.'
        };
      }
      return {
        success: false,
        errorCode: result.errorCode || 'NOT_FOUND',
        error: result.message || 'Application not found. Please check your Application ID and try again.',
        message: result.message || 'Application not found. Please check your Application ID and try again.'
      };
    }

    return {
      success: false,
      errorCode: 'NOT_FOUND',
      error: 'Application not found. Please check your Application ID and try again.',
      message: 'Application not found. Please check your Application ID and try again.'
    };
  } catch {
    return {
      success: false,
      errorCode: 'SERVER_ERROR',
      error: 'Unable to connect to the application tracking service. Please try again later.',
      message: 'Unable to connect to the application tracking service. Please try again later.'
    };
  }
}
