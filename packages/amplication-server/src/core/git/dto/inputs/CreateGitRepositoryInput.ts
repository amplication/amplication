import { ArgsType, Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
@ArgsType()
export class CreateGitRepositoryInput {
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  appId!: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String, { nullable: false })
  gitOrganizationId!: string;
}
