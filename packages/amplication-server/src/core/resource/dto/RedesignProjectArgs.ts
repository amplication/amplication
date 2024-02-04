import { ArgsType, Field } from "@nestjs/graphql";
import { RedesignProjectInput } from "./RedesignProjectInput";

@ArgsType()
export class RedesignProjectArgs {
  @Field(() => RedesignProjectInput, { nullable: false })
  data!: RedesignProjectInput;
}
