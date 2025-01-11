import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceSetOwnerInput } from "./ResourceSetOwnerInput";

@ArgsType()
export class SetResourceOwnerArgs {
  @Field(() => ResourceSetOwnerInput, { nullable: false })
  data!: ResourceSetOwnerInput;
}
