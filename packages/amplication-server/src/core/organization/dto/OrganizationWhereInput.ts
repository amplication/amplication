import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter, StringFilter } from 'src/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class OrganizationWhereInput {
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  id?: string | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  name?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  defaultTimeZone?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  address?: StringFilter | null;

  // @Field(() => [OrganizationWhereInput], {
  //   nullable: true,
  //   description: undefined
  // })
  // AND?: OrganizationWhereInput[] | null;

  // @Field(() => [OrganizationWhereInput], {
  //   nullable: true,
  //   description: undefined
  // })
  // OR?: OrganizationWhereInput[] | null;

  // @Field(() => [OrganizationWhereInput], {
  //   nullable: true,
  //   description: undefined
  // })
  // NOT?: OrganizationWhereInput[] | null;
}
