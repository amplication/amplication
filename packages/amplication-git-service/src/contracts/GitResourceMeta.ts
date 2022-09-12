//TODO: REMOVE CLASS VALIDATOR!!!!!! ACCESS DEPENDENCY!!!
import { IsString } from 'class-validator';

export class GitResourceMeta {
  @IsString()
  serverPath: string;
  @IsString()
  adminUIPath: string;
}
