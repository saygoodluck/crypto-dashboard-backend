import { IsEmail } from 'class-validator';

export class RequestResetPasswordDto {
  @IsEmail()
  public email: string;
}
