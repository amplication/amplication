import { Field, InputType } from "@nestjs/graphql";
import { ResourceWhereInput } from "../../resource/dto";
import { WhereUniqueInput, DateTimeFilter, StringFilter } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class BlockTypeWhereInput {
  @Field(() => StringFilter, {
    nullable: true,
  })
  id?: StringFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => ResourceWhereInput, {
    nullable: true,
  })
  resource?: ResourceWhereInput | null;

  @Field(() => WhereUniqueInput, {
    nullable: true,
  })
  parentBlock?: WhereUniqueInput | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  displayName?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  description?: StringFilter | null;

  // AND?: BlockWhereInput[] | null;

  // OR?: BlockWhereInput[] | null;

  // NOT?: BlockWhereInput[] | null;
}
