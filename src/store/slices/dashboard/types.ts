export interface DashboardStats {
  total_schools: number;
  total_users: number;
  system_health?: string;
  activeSchools?: number;
  totalStudents?: number;
  totalTeachers?: number;
  activeTeachers?: number;
  activeStudents?: number;
}

export interface AnalyticsSummary {
  // Common fields for analytics
  attendance_rate?: number;
  average_score?: number;
  total_lessons?: number;
  active_students?: number;
  [key: string]: any;
}

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface DashboardState {
  stats: DashboardStats;
  analytics: AnalyticsSummary | null;
  recentActivities: RecentActivity[];
  loading: boolean;
  error: string | null;
  analyticsFilters: {
    period: string;
    class_id: string;
    subject_id: string;
  };
}
