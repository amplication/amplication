import { EntityCreateInput } from "./EntityCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateOneEntityArgs {
  @Field(() => EntityCreateInput, { nullable: false })
  data!: EntityCreateInput;
}
