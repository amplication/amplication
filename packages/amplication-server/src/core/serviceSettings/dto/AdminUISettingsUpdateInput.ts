import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class AdminUISettingsUpdateInput {
  @Field(() => Boolean, {
    nullable: true,
  })
  generateAdminUI?: boolean;

  @Field(() => String, {
    nullable: true,
  })
  adminUIPath?: string;
}
