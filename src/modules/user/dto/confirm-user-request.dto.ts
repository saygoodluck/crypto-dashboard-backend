export class ConfirmUserRequestDto {
  public applicantId: string;
  public inspectionId: string;
  public correlationId: string;
  public externalUserId: string;
  public levelName: string;
  public type: 'applicantReviewed';
  public reviewResult: { reviewAnswer: 'GREEN' | 'RED' };
  public reviewStatus: string;
  public createdAt: string;
}
