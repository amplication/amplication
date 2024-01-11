import { BlockVersionCreateInput } from "./BlockVersionCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateBlockVersionArgs {
  @Field(() => BlockVersionCreateInput, { nullable: false })
  data!: BlockVersionCreateInput;
}
