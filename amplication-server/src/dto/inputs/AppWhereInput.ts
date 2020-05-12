import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter } from './DateTimeFilter';
import { EntityFilter } from './EntityFilter';
import { OrganizationWhereInput } from './OrganizationWhereInput';
import { StringFilter } from './StringFilter';

@InputType({
  isAbstract: true,
  description: undefined
})
export class AppWhereInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  id?: string | null;

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
  name?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  description?: StringFilter | null;

  @Field(_type => OrganizationWhereInput, {
    nullable: true,
    description: undefined
  })
  organization?: OrganizationWhereInput | null;
}
