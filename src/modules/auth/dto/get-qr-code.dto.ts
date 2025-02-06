import { IsEmail } from 'class-validator';

export class GetQrCodeDto {
  @IsEmail()
  public email: string;
}
