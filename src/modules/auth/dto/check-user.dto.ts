import { IsOptional, IsString } from 'class-validator';

export class CheckUserDto {
  @IsString()
  public email: string;

  @IsOptional()
  @IsString()
  public password: string;
}
