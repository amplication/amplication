import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceCreateWithEntitiesInput } from "./ResourceCreateWithEntitiesInput";

@ArgsType()
export class CreateServiceWithEntitiesArgs {
  @Field(() => ResourceCreateWithEntitiesInput, { nullable: false })
  data!: ResourceCreateWithEntitiesInput;
}
