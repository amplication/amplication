import { ResourceCreateCopiedEntitiesInput } from "./ResourceCreateCopiedEntitiesInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateResourceEntitiesArgs {
  @Field(() => ResourceCreateCopiedEntitiesInput, { nullable: false })
  data!: ResourceCreateCopiedEntitiesInput;
}
