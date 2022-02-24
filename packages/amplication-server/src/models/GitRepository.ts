import { Field, ObjectType } from '@nestjs/graphql';
import { GitOrganization } from './GitOrganization';
@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GitRepository {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  gitOrganizationId!: string;

  @Field(() => GitOrganization, { nullable: true })
  gitOrganization?: GitOrganization;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt?: Date;
}
