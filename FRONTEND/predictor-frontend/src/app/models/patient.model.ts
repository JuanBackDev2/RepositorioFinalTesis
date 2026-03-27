export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  status: 'STABLE' | 'CRITICAL' | 'SCHEDULED';
  lastVisit: string;
}