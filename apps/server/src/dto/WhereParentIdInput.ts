import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput } from "./WhereUniqueInput";

@InputType({
  isAbstract: true,
})
export class WhereParentIdInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
  })
  connect: WhereUniqueInput;
}
