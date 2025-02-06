import { IsString } from 'class-validator';

export class ChangeRoleDto {
  @IsString()
  public role: string;
}
