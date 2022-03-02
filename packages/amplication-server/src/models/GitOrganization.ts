import { Field, ObjectType } from '@nestjs/graphql';
import { EnumGitProvider } from 'src/core/git/dto/enums/EnumGitProvider';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GitOrganization {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  provider!: EnumGitProvider;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  installationId!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;
}
