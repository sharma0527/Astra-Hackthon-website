export type ApplicationStatus = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'CONFIRMED'
  | 'WAITLISTED'
  | 'REJECTED'
  | 'DUPLICATE'
  | 'COMPLETED'
  | string;

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
  status: ApplicationStatus;
  lastUpdated: string;
  reviewNotes?: string;
  college?: string;
  track?: string;
}

// Backward compatibility aliases
export type Application = ApplicationData;
export type ApplicationRecord = ApplicationData;

export interface ApiResponse {
  success: boolean;
  message?: string;
  errorCode?: string;
  application?: ApplicationData;
  data?: ApplicationData;
}

export type ApplicationResponse = ApiResponse;

export interface TrackingResult {
  success: boolean;
  application?: ApplicationData;
  data?: ApplicationData;
  message?: string;
  error?: string;
  errorCode?: string;
}
