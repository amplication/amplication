import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter } from '../inputs/DateTimeFilter';
import { EntityFieldFilter } from '../inputs/EntityFieldFilter';
import { EntityWhereInput } from '../inputs/EntityWhereInput';
import { IntFilter } from '../inputs/IntFilter';
import { StringFilter } from '../inputs/StringFilter';
import { WhereUniqueInput } from './WhereUniqueInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityVersionWhereInput {
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

  @Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  versionNumber?: IntFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  label?: StringFilter | null;

  @Field(_type => WhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  entity: WhereUniqueInput;
}
