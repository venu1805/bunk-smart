
export interface AttendanceRecord {
  id: string;
  timestamp: number;
  type: 'present' | 'absent';
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  history: AttendanceRecord[];
}

export interface UserProfile {
  name: string;
  usn: string;
  semester: string;
  collegeName: string;
  email: string;
}

export interface UserSettings {
  targetPercentage: number;
  profile: UserProfile | null;
  isLoggedIn: boolean;
  hasCompletedSetup: boolean;
}

export interface AttendanceMetrics {
  total: number;
  attended: number;
  percentage: number;
  safeToBunk: number;
  mustAttend: number;
  status: 'safe' | 'warning' | 'critical';
}
