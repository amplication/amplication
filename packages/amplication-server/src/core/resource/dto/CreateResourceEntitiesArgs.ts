import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceCreateCopiedEntitiesInput } from "./ResourceCreateCopiedEntitiesInput";
import { ResourceCreateInput } from "./ResourceCreateInput";

@ArgsType()
export class CreateResourceEntitiesArgs {
  @Field(() => ResourceCreateCopiedEntitiesInput, { nullable: false })
  data!: ResourceCreateCopiedEntitiesInput;
}
