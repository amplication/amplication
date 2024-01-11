import { BuildCreateInput } from "./BuildCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateBuildArgs {
  @Field(() => BuildCreateInput, { nullable: false })
  data!: BuildCreateInput;
}
