import { WhereUniqueInput } from "../../../dto";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class AvailableGithubReposFindInput {
  @Field(() => WhereUniqueInput, {
    nullable: false,
  })
  resource!: WhereUniqueInput;
}
