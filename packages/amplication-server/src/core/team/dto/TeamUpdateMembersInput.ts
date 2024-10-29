import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class TeamUpdateMembersInput {
  @Field(() => [String], { nullable: false })
  userIds!: string[] | undefined;
}
