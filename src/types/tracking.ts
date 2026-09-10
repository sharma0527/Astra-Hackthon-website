export type ApplicationStatus = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'CONFIRMED'
  | 'WAITLISTED'
  | 'REJECTED'
  | 'COMPLETED'
  | string;

export interface ApplicationMember {
  name: string;
}

export interface Application {
  applicationId: string;
  teamId: string;
  teamName: string;
  teamLead: string;
  email: string;
  college: string;
  branch: string;
  track: string;
  members: Array<{ name: string } | string>;
  memberCount?: number;
  status: ApplicationStatus;
  lastUpdated?: string;
  reviewNotes?: string;
}

// Backward compatibility alias
export type ApplicationRecord = Application;

export interface TrackingResult {
  success: boolean;
  application?: Application;
  data?: Application;
  message?: string;
  error?: string;
  errorCode?: 'EMPTY_INPUT' | 'INVALID_FORMAT' | 'NOT_FOUND' | 'NETWORK_ERROR';
}
