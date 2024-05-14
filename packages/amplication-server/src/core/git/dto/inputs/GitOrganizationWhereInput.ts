import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
@InputType()
class GitOrganizationWhereInput {
  @Type(() => String)
  @Field(() => String, {
    nullable: true,
  })
  id?: string;

  // missing the field decorator because its inject with the InjectContextValue decorator
  workspaceId?: string;
}
export { GitOrganizationWhereInput };
