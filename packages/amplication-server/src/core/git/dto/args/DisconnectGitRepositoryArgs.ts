import { ArgsType, Field } from '@nestjs/graphql';
import {} from '../inputs/ConnectGitRepositoryInput';

@ArgsType()
export class DisconnectGitRepositoryArgs {
  @Field(() => String, { nullable: false })
  resourceId!: string;
}
