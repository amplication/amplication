import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class CompareResourceVersionsWhereInput {
  @Field(() => WhereUniqueInput)
  resource!: WhereUniqueInput;

  @Field(() => String)
  sourceVersion!: string;

  @Field(() => String)
  targetVersion!: string;
}
