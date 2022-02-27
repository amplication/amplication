import { Field, ObjectType } from '@nestjs/graphql';
import { EnumGitProvider } from 'src/core/git/dto/enums/EnumGitProvider';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GitOrganization {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => EnumGitProvider, {
    nullable: false
  })
  provider!: keyof typeof EnumGitProvider;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  installationId!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;
}
