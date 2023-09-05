import { Field, InputType } from "@nestjs/graphql";
import { WhereUniqueInput, DateTimeFilter, StringFilter } from "../../../dto";
import { EntityFieldFilter } from "./EntityFieldFilter";

@InputType({
  isAbstract: true,
})
export class EntityWhereInput {
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

  @Field(() => StringFilter, {
    nullable: true,
  })
  name?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  displayName?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  pluralDisplayName?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  customAttributes?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
  })
  description?: StringFilter | null;

  @Field(() => EntityFieldFilter, {
    nullable: true,
  })
  fields?: EntityFieldFilter | null;

  @Field(() => WhereUniqueInput, {
    nullable: true,
  })
  resource?: WhereUniqueInput | null;
}
