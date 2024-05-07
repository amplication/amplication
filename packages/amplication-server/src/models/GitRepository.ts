import { Field, ObjectType } from "@nestjs/graphql";
import { GitOrganization } from "./GitOrganization";
@ObjectType({
  isAbstract: true,
})
export class GitRepository {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  gitOrganizationId!: string;

  @Field(() => GitOrganization, { nullable: false })
  gitOrganization?: GitOrganization; //TODO move to must

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: true })
  groupName?: string;

  @Field(() => String, { nullable: true })
  baseBranchName?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
