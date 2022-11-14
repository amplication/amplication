import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto/";

@InputType({
  isAbstract: true,
})
export class PendingChangesFindInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
  })
  project!: WhereUniqueInput;
}
