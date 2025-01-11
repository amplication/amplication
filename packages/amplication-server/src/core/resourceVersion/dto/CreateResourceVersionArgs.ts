import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceVersionCreateInput } from "./ResourceVersionCreateInput";

@ArgsType()
export class CreateResourceVersionArgs {
  @Field(() => ResourceVersionCreateInput, { nullable: false })
  data!: ResourceVersionCreateInput;
}
