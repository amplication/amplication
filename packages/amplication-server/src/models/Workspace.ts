import { GitOrganization } from "./GitOrganization";
import { Project } from "./Project";
import { User } from "./User";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class Workspace {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
  })
  updatedAt!: Date;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => [Project])
  projects?: Project[];

  @Field(() => [GitOrganization], { nullable: true })
  gitOrganizations?: GitOrganization[];

  @Field(() => [User])
  users?: User[];

  @Field(() => String, {
    nullable: true,
  })
  externalId?: string;
}
