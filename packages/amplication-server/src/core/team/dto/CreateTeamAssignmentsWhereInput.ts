import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class CreateTeamAssignmentsWhereInput {
  @Field(() => String, { nullable: false })
  resourceId!: string;
}
