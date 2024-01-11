import { WhereUniqueInput } from "../../../dto/";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class PendingChangesFindInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
  })
  project!: WhereUniqueInput;
}
