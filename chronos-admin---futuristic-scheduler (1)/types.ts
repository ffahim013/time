
export interface Schedule {
  id: string;
  title: string;
  time: string;
  description: string;
  category: 'work' | 'personal' | 'urgent' | 'break';
  timestamp: number;
}

export interface User {
  username: string;
  role: 'admin' | 'viewer';
}

export type ThemeType = 'cyber' | 'minimal' | 'nebula';

export interface AppState {
  schedules: Schedule[];
  currentUser: User | null;
  theme: ThemeType;
}
