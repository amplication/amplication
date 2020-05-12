import { Field, InputType } from '@nestjs/graphql';
import { AccountWhereInput } from './AccountWhereInput';
import { DateTimeFilter } from './DateTimeFilter';
import { OrganizationWhereInput } from './OrganizationWhereInput';
import { StringFilter } from './StringFilter';

@InputType({
  isAbstract: true,
  description: undefined
})
export class AccountUserWhereInput {
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

  @Field(_type => [AccountUserWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: AccountUserWhereInput[] | null;

  @Field(_type => [AccountUserWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: AccountUserWhereInput[] | null;

  @Field(_type => [AccountUserWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: AccountUserWhereInput[] | null;

  @Field(_type => AccountWhereInput, {
    nullable: true,
    description: undefined
  })
  account?: AccountWhereInput | null;

  @Field(_type => OrganizationWhereInput, {
    nullable: true,
    description: undefined
  })
  organization?: OrganizationWhereInput | null;
}
