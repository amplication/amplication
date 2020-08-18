import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from 'src/enums/SortOrder';

@InputType({
  isAbstract: true,
  description: undefined
})
export class OrganizationOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  id?: keyof typeof SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  createdAt?: keyof typeof SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  updatedAt?: keyof typeof SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  name?: keyof typeof SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  defaultTimeZone?: keyof typeof SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  address?: keyof typeof SortOrder | null;
}
