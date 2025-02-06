import { IsEmail, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  @IsIn(['user', 'admin'])
  public type: string;

  @IsNumber()
  @IsOptional()
  public pin: number;
}
