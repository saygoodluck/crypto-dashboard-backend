import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @MinLength(8)
  public password: string;

  @IsOptional()
  @IsNumber()
  public activeTransactionId: number;

  @IsString()
  public country: string;

  @IsString()
  public city: string;

  @IsString()
  public zipCode: string;

  @IsString()
  public address: string;

  @IsIn(['Individual', 'Business'])
  public type: string;
}
