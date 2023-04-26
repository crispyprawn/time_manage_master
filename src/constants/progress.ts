export enum ProgressStatus {
  DELIVER_RESUME = 1,
  ASSESSMENT = 2,
  WRITTEN_INTERVIEW = 3,
  FACE_INTERVIEW_1 = 4,
  FACE_INTERVIEW_2 = 5,
  FACE_INTERVIEW_3 = 6,
  FACE_INTERVIEW_HR = 7,
  OFFER_CALL = 8,
}

export const EventNameMap = {
  [ProgressStatus.DELIVER_RESUME]: '投递简历',
  [ProgressStatus.ASSESSMENT]: '职业测评',
  [ProgressStatus.WRITTEN_INTERVIEW]: '笔试',
  [ProgressStatus.FACE_INTERVIEW_1]: '一面',
  [ProgressStatus.FACE_INTERVIEW_2]: '二面',
  [ProgressStatus.FACE_INTERVIEW_3]: '三面',
  [ProgressStatus.FACE_INTERVIEW_HR]: 'HR面',
  [ProgressStatus.OFFER_CALL]: 'oc',
};
