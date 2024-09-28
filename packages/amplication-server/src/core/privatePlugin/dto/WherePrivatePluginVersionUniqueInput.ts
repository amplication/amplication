import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class WherePrivatePluginVersionUniqueInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
  })
  privatePlugin: WhereUniqueInput;

  @Field(() => String, {
    nullable: false,
  })
  version: string;
}
