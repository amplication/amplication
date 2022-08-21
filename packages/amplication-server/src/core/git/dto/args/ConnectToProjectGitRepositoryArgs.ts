import { ArgsType, Field } from '@nestjs/graphql';
import {} from '../inputs/ConnectGitRepositoryInput';

@ArgsType()
export class ConnectToProjectGitRepositoryArgs {
  @Field(() => String, { nullable: false })
  resourceId!: string;
}
