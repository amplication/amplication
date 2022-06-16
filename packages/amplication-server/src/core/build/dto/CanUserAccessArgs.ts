import { ArgsType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class CanUserAccessArgs {
  @IsString()
  userId!: string;
  @IsString()
  buildId!: string;
}
