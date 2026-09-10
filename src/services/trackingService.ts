import type { Application, TrackingResult, ApplicationStatus } from '../types/tracking';
import { trackApplication as queryLiveApi, validateApplicationId } from './applicationApi';

export type { Application, TrackingResult, ApplicationStatus };
export { validateApplicationId };

/**
 * Track application directly via live Google Apps Script Web App API.
 * Mock data has been completely removed per requirements.
 */
export async function trackApplication(rawId: string): Promise<TrackingResult> {
  return await queryLiveApi(rawId);
}
