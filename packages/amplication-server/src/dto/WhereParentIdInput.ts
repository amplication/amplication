import { WhereUniqueInput } from "../dto/WhereUniqueInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class WhereParentIdInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
  })
  connect: WhereUniqueInput;
}
