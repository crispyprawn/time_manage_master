import {ProgressStage, ProgressStatus} from '../constants/progress';

export interface Progress {
  companyName: string;
  progressID: string;
  createTime: number;
  updateTime: number;
  events: Event[];
  status: ProgressStatus;
}

export interface Event {
  progressStage: ProgressStage;
  eventID: string;
  startTime: number;
  endTime: number;
  calendarSubscribed: boolean;
  calendarEventID: string;
  experience?: string;
}

export interface EventWithCompany extends Event {
  companyName: string;
  progressID: string;
}
