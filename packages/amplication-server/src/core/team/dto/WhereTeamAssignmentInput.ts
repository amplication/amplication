import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class WhereTeamAssignmentInput {
  @Field(() => String, {
    nullable: false,
  })
  teamId!: string;

  @Field(() => String, {
    nullable: false,
  })
  resourceId!: string;
}
