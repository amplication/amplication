import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class WhereEnumMemberUniqueInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
  })
  moduleDto: WhereUniqueInput;

  @Field(() => String, {
    nullable: false,
  })
  enumMemberName: string;
}
