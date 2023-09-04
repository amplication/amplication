import { InputType, Field } from "@nestjs/graphql";
import { WhereUniqueInput, DateTimeFilter, StringFilter } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class EnvironmentWhereInput {
  @Field(() => StringFilter, {
    nullable: true,
  })
  id?: StringFilter | null | undefined;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  createdAt?: DateTimeFilter | null | undefined;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  updatedAt?: DateTimeFilter | null | undefined;

  @Field(() => WhereUniqueInput)
  resource?: WhereUniqueInput;

  @Field(() => StringFilter, {
    nullable: true,
  })
  name?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  description?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  address?: StringFilter | null;
}
