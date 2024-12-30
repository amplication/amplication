import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "./Role";

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

  @Field(() => String, {
    nullable: true,
  })
  teamId!: string;

  @Field(() => [Role], {
    nullable: true,
  })
  roles?: Role[];
}
