import { ArgsType, Field } from "@nestjs/graphql";
import { ResourcesCreateCopiedEntitiesInput } from "./ResourceCreateCopiedEntitiesInput";

@ArgsType()
export class CreateResourcesEntitiesArgs {
  @Field(() => ResourcesCreateCopiedEntitiesInput, { nullable: false })
  data!: ResourcesCreateCopiedEntitiesInput;
}
