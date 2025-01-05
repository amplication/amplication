import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class AddMemberToTeamsInput {
  @Field(() => [String], { nullable: false })
  teamIds!: string[] | undefined;
}
