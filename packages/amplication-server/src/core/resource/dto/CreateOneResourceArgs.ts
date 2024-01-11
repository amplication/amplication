import { ResourceCreateInput } from "./ResourceCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateOneResourceArgs {
  @Field(() => ResourceCreateInput, { nullable: false })
  data!: ResourceCreateInput;
}
