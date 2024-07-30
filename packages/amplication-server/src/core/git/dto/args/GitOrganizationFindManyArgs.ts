import { ArgsType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { GitOrganizationWhereInput } from "../inputs/GitOrganizationWhereInput";

@ArgsType()
class GitOrganizationFindManyArgs {
  @Field(() => GitOrganizationWhereInput, { nullable: true })
  @Type(() => GitOrganizationWhereInput)
  where?: GitOrganizationWhereInput;

  @Field(() => Number, { nullable: true })
  @Type(() => Number)
  skip?: number;

  @Field(() => Number, { nullable: true })
  @Type(() => Number)
  take?: number;
}

export { GitOrganizationFindManyArgs };
