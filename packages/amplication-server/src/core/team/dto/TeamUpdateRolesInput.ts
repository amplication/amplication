import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class TeamUpdateRolesInput {
  @Field(() => [String], { nullable: false })
  roleIds!: string[] | undefined;
}
