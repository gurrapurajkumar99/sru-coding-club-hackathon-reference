export type UserRole = 'student' | 'admin';

export type IssueStatus = 'Reported' | 'In Progress' | 'Resolved';

export type IssuePriority = 'Low' | 'Medium' | 'High';

export type IssueCategory =
  | 'Maintenance'
  | 'IT Support'
  | 'Facilities'
  | 'Security'
  | 'Cleanliness'
  | 'Equipment'
  | 'Other';

export interface Issue {
  id: string;
  location: string;
  category: IssueCategory;
  priority: IssuePriority;
  description: string;
  status: IssueStatus;
  reportedBy: string;
  reportedAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
