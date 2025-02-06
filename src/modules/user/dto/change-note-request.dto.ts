import { IsOptional, IsString } from 'class-validator';

export class ChangeNoteRequestDto {
  @IsString()
  @IsOptional()
  public note: string;
}
