import type { ApplicationData, TrackingResult, ApplicationStatus } from '../types/tracking';
import { trackApplication as queryLiveApi, validateApplicationId } from './applicationApi';

export type { ApplicationData, TrackingResult, ApplicationStatus };
export { validateApplicationId };

/**
 * Track application directly via live Google Apps Script Web App API.
 */
export async function trackApplication(rawId: string): Promise<TrackingResult> {
  try {
    const app = await queryLiveApi(rawId);
    return {
      success: true,
      application: app,
      data: app
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Application not found. Please check your Application ID and try again.',
      message: err?.message || 'Application not found. Please check your Application ID and try again.'
    };
  }
}
