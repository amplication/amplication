import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceCreateEntitiesInput } from "./ResourceCreateEntitiesInput";
import { ResourceCreateInput } from "./ResourceCreateInput";

@ArgsType()
export class CreateResourceEntitiesArgs {
  @Field(() => ResourceCreateEntitiesInput, { nullable: false })
  data!: ResourceCreateEntitiesInput;
}
