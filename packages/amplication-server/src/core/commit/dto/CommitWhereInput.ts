import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput, DateTimeFilter, StringFilter } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class CommitWhereInput {
  @Field(() => StringFilter, {
    nullable: true,
  })
  id?: StringFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => WhereUniqueInput)
  project?: WhereUniqueInput;

  @Field(() => WhereUniqueInput, {
    nullable: true,
  })
  user?: WhereUniqueInput | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  message?: StringFilter | null;
}
