import { EnvironmentCreateInput } from "./EnvironmentCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateEnvironmentArgs {
  @Field(() => EnvironmentCreateInput, { nullable: false })
  data!: EnvironmentCreateInput;
}
