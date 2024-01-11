import { EntityVersionCreateInput } from "./EntityVersionCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateOneEntityVersionArgs {
  @Field(() => EntityVersionCreateInput, { nullable: false })
  data!: EntityVersionCreateInput;
}
