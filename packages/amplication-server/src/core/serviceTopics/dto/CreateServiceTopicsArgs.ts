import { ServiceTopicsCreateInput } from "./ServiceTopicsCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateServiceTopicsArgs {
  @Field(() => ServiceTopicsCreateInput, { nullable: false })
  data!: ServiceTopicsCreateInput;
}
