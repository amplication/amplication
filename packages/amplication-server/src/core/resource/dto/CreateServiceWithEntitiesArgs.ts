import { ResourceCreateWithEntitiesInput } from "./ResourceCreateWithEntitiesInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateServiceWithEntitiesArgs {
  @Field(() => ResourceCreateWithEntitiesInput, { nullable: false })
  data!: ResourceCreateWithEntitiesInput;
}
