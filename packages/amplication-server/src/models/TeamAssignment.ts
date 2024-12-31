import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "./Role";
import { Team } from "./Team";
import { Resource } from "./Resource";

@ObjectType({
  isAbstract: true,
})
export class TeamAssignment {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => String, {
    nullable: false,
  })
  resourceId!: string;

  @Field(() => Resource, {
    nullable: false,
  })
  resource?: Resource;

  @Field(() => String, {
    nullable: true,
  })
  teamId!: string;

  @Field(() => Team, {
    nullable: true,
  })
  team?: Team;

  @Field(() => [Role], {
    nullable: true,
  })
  roles?: Role[];
}
