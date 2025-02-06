export class QRCodeDetailsDto {
  public key: string;
  public imageUrl: string;

  constructor(info: { key: string; imageUrl: string }) {
    this.key = info.key;
    this.imageUrl = info.imageUrl;
  }
}
