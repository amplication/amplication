import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter } from './DateTimeFilter';
import { StringFilter } from './StringFilter';

@InputType({
  isAbstract: true,
  description: undefined
})
export class OrganizationWhereInput {
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
  defaultTimeZone?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  address?: StringFilter | null;

  // @Field(_type => [OrganizationWhereInput], {
  //   nullable: true,
  //   description: undefined
  // })
  // AND?: OrganizationWhereInput[] | null;

  // @Field(_type => [OrganizationWhereInput], {
  //   nullable: true,
  //   description: undefined
  // })
  // OR?: OrganizationWhereInput[] | null;

  // @Field(_type => [OrganizationWhereInput], {
  //   nullable: true,
  //   description: undefined
  // })
  // NOT?: OrganizationWhereInput[] | null;
}
