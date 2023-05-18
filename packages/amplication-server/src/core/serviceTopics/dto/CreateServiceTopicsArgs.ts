import { ArgsType, Field } from "@nestjs/graphql";
import { ServiceTopicsCreateInput } from "./ServiceTopicsCreateInput";

@ArgsType()
export class CreateServiceTopicsArgs {
  @Field(() => ServiceTopicsCreateInput, { nullable: false })
  data!: ServiceTopicsCreateInput;
}
