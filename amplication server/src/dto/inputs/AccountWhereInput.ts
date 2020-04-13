import { Field, InputType } from "@nestjs/graphql";
import { AccountUserFilter } from "./AccountUserFilter";
import { DateTimeFilter } from "./DateTimeFilter";
import { StringFilter } from "./StringFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class AccountWhereInput {
  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  id?: StringFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  email?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  firstname?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  lastName?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  password?: StringFilter | null;

  @Field(_type => AccountUserFilter, {
    nullable: true,
    description: undefined
  })
  accountUsers?: AccountUserFilter | null;

  @Field(_type => [AccountWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: AccountWhereInput[] | null;

  @Field(_type => [AccountWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: AccountWhereInput[] | null;

  @Field(_type => [AccountWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: AccountWhereInput[] | null;
}
