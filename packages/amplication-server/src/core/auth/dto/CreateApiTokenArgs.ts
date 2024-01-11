import { ApiTokenCreateInput } from "./ApiTokenCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateApiTokenArgs {
  @Field(() => ApiTokenCreateInput, { nullable: false })
  data!: ApiTokenCreateInput;
}
