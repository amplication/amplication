import { ArgsType, Field } from "@nestjs/graphql";
import {
  ResourceCreateCopiedEntitiesInput,
  ResourcesCreateCopiedEntitiesInput,
} from "./ResourceCreateCopiedEntitiesInput";

@ArgsType()
export class CreateResourceEntitiesArgs {
  @Field(() => ResourceCreateCopiedEntitiesInput, { nullable: false })
  data!: ResourceCreateCopiedEntitiesInput;
}

@ArgsType()
export class CreateResourcesEntitiesArgs {
  @Field(() => ResourcesCreateCopiedEntitiesInput, { nullable: false })
  data!: ResourcesCreateCopiedEntitiesInput;
}
