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
  eventTime: number;
  calendarSubscribed: boolean;
}
