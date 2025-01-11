import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class RoleAddRemovePermissionsInput {
  @Field(() => [String], { nullable: false })
  permissions!: string[];
}
