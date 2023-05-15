export enum ProgressStage {
  DELIVER_RESUME = 1,
  ASSESSMENT = 2,
  WRITTEN_INTERVIEW = 3,
  FACE_INTERVIEW_1 = 4,
  FACE_INTERVIEW_2 = 5,
  FACE_INTERVIEW_3 = 6,
  FACE_INTERVIEW_HR = 7,
  OFFER_CALL = 8,
}

export enum ProgressStatus {
  PENDING = 1,
  SUCCESS = 2,
  FAILURE = 3,
}

export const ProgressStatusList = [
  ProgressStatus.PENDING,
  ProgressStatus.SUCCESS,
  ProgressStatus.FAILURE,
];

export type ProgressStageKey = keyof typeof ProgressStage;

export const ProgressStageList = [
  ProgressStage.DELIVER_RESUME,
  ProgressStage.ASSESSMENT,
  ProgressStage.WRITTEN_INTERVIEW,
  ProgressStage.FACE_INTERVIEW_1,
  ProgressStage.FACE_INTERVIEW_2,
  ProgressStage.FACE_INTERVIEW_3,
  ProgressStage.FACE_INTERVIEW_HR,
  ProgressStage.OFFER_CALL,
];

export const EventNameMap = {
  [ProgressStage.DELIVER_RESUME]: '投递简历',
  [ProgressStage.ASSESSMENT]: '职业测评',
  [ProgressStage.WRITTEN_INTERVIEW]: '笔试',
  [ProgressStage.FACE_INTERVIEW_1]: '一面',
  [ProgressStage.FACE_INTERVIEW_2]: '二面',
  [ProgressStage.FACE_INTERVIEW_3]: '三面',
  [ProgressStage.FACE_INTERVIEW_HR]: 'HR面',
  [ProgressStage.OFFER_CALL]: 'oc',
};
