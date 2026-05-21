export interface TeacherStatisticsData {
  teacher_id: string;
  preparations: number;
  exams: number;
  homework: number;
  attachments: number;
  videos: number;
  audio_files: number;
  documents: number;
  photos: number;
  presentations: number;
  weekly_quota: number;
  total_content: number;
}

export interface TeacherCommunicationMonthItem {
  month: number;
  month_name: string;
  month_name_ar: string;
  year: number;
  total_messages: number;
  messages_sent: number;
  messages_received: number;
}

export interface TeacherCommunicationTrendData {
  teacher_id: string;
  period: string;
  period_ar: string;
  data: TeacherCommunicationMonthItem[];
  total_messages: number;
  trend_percentage: number;
  trend_direction: "up" | "down" | string;
}

export interface TeacherAttendanceStatisticsData {
  teacher_id: string;
  month: number;
  year: number;
  on_time: number;
  late: number;
  absent: number;
  total_days: number;
  attendance_rate: number;
  improvement_percentage: number;
}

export interface TeachersStatisticsState {
  data: TeacherStatisticsData | null;
  communicationsTrend: TeacherCommunicationTrendData | null;
  attendanceStatistics: TeacherAttendanceStatisticsData | null;
  loading: {
    main: boolean;
    communications: boolean;
    attendance: boolean;
  };
  error: {
    main: string | null;
    communications: string | null;
    attendance: string | null;
  };
}
