import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceCreateInput } from "./ResourceCreateInput";

@ArgsType()
export class CreateOneResourceArgs {
  @Field(() => ResourceCreateInput, { nullable: false })
  data!: ResourceCreateInput;
}
