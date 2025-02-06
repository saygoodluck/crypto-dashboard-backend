import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(8)
  @IsString()
  public password: string;
}
