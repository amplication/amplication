import { IsString } from 'class-validator';

export class ChangedFile {
  @IsString()
  path!: string;
}
