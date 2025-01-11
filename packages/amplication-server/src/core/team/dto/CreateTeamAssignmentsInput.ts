import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class CreateTeamAssignmentsInput {
  @Field(() => [String], { nullable: false })
  teamIds!: string[];
}
