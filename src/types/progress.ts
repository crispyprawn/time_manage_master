import {ProgressStatus} from '../constants/progress';

export interface Progress {
  companyName: string;
  progressID: string;
  createTime: number;
  updateTime: number;
  events: Event[];
}

export interface Event {
  progressStatus: ProgressStatus;
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
