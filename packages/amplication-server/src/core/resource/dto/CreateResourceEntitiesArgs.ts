import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceCreateCopiedEntitiesInput } from "./ResourceCreateCopiedEntitiesInput";

@ArgsType()
export class CreateResourceEntitiesArgs {
  @Field(() => ResourceCreateCopiedEntitiesInput, { nullable: false })
  data!: ResourceCreateCopiedEntitiesInput;
}
