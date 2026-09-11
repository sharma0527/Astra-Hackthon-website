export type ApplicationStatus = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'CONFIRMED'
  | 'WAITLISTED'
  | 'REJECTED'
  | 'COMPLETED'
  | string;

export interface TeamMember {
  name: string;
  role?: string;
}

export interface Application {
  applicationId: string;
  teamId: string;
  teamName: string;
  teamLead: string;
  email?: string;
  maskedEmail?: string;
  college?: string;
  branch?: string;
  problemStatement?: string;
  domain?: string;
  track?: string;
  members: TeamMember[];
  memberCount?: number;
  status: ApplicationStatus;
  lastUpdated?: string;
  reviewNotes?: string;
}

// Backward compatibility alias
export type ApplicationRecord = Application;

export interface ApplicationResponse {
  success: boolean;
  message?: string;
  application?: Application;
  data?: Application;
  errorCode?: string;
}

export interface TrackingResult {
  success: boolean;
  application?: Application;
  data?: Application;
  message?: string;
  error?: string;
  errorCode?: string;
}
