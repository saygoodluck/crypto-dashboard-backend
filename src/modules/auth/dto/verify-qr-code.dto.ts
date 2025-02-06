import { IsEmail, IsNumber } from 'class-validator';

export class VerifyQrCodeDto {
  @IsEmail()
  public email: string;

  @IsNumber()
  public pin: number;
}
