import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class WhereCustomPropertyOptionUniqueInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
  })
  customProperty: WhereUniqueInput;

  @Field(() => String, {
    nullable: false,
  })
  value: string;
}
