import { EnumGitOrganizationType } from '@amplication/git-service/src/Dto/enums/EnumGitOrganizationType';
import { EnumGitProvider } from '@amplication/git-service/src/Dto/enums/EnumGitProvider';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GitOrganization {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  provider!: keyof typeof EnumGitProvider;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  installationId!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => EnumGitOrganizationType, { nullable: false })
  type!: keyof typeof EnumGitOrganizationType;
}
