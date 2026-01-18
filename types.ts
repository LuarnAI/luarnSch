
export interface TimeSlot {
  id: string;
  name: string;
  start: string; // HH:mm
  end: string;   // HH:mm
}

export interface BroadcastTemplate {
  id: string;
  btnName: string;
  title: string;
  subtitle: string;
}

export interface TimetableData {
  [day: number]: { [slotId: string]: string }; // day 0-6 (Sun-Sat), slotId: subject
}

export type ViewState = 'main' | 'broadcast' | 'settings';

export const DAYS_ZH = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

/**
 * Added missing ViewType enum used in Header.tsx
 */
export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  CALCULATOR = 'CALCULATOR',
  AI_ASSISTANT = 'AI_ASSISTANT'
}

/**
 * Added missing Course interface used in GradeCalculator, Dashboard, and AIAssistant
 */
export interface Course {
  id: string;
  name: string;
  credits: number;
  score: number;
  category: string;
}

/**
 * Added missing Semester interface used in Dashboard and GradeCalculator
 */
export interface Semester {
  id: string;
  title: string;
  courses: Course[];
}
