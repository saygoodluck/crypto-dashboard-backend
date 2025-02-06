import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(8)
  @IsOptional()
  public oldPassword: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  public newPassword: string;

  @IsString()
  @IsOptional()
  public country: string;

  @IsString()
  @IsOptional()
  public city: string;

  @IsString()
  @IsOptional()
  public zipCode: string;

  @IsString()
  @IsOptional()
  public address: string;
}
