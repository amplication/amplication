/*
 TODO: remove class-validator dependency.
  class-validator should not be a part of this library.
  It was added because it was missing for the library to compile.
  Their is no use in class-validator in this library, and the reason
  that it is here it that this class was moved from another project to here.
  this is creating an access dependency to this library.
 */

import { IsString } from 'class-validator';

export class GitResourceMeta {
  @IsString()
  serverPath: string;
  @IsString()
  adminUIPath: string;
}
