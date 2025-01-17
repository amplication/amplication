import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class CreateTemplateFromResourceInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
  })
  resource!: WhereUniqueInput;
}
