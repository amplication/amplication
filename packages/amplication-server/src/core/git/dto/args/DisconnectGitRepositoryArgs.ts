import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class DisconnectGitRepositoryArgs {
  @Field(() => String, { nullable: false })
  resourceId!: string;
}
