import { IsString, MinLength } from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @MinLength(8)
  public oldPassword: string;

  @IsString()
  @MinLength(8)
  public newPassword: string;
}
