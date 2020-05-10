import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter } from '../inputs/DateTimeFilter';
import { EntityFieldFilter } from '../inputs/EntityFieldFilter';
import { EntityWhereInput } from '../inputs/EntityWhereInput';
import { IntFilter } from '../inputs/IntFilter';
import { StringFilter } from '../inputs/StringFilter';

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
  Label?: StringFilter | null;

  @Field(_type => EntityFieldFilter, {
    nullable: true,
    description: undefined
  })
  entityFields?: EntityFieldFilter | null;

  @Field(_type => [EntityVersionWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: EntityVersionWhereInput[] | null;

  @Field(_type => [EntityVersionWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: EntityVersionWhereInput[] | null;

  @Field(_type => [EntityVersionWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: EntityVersionWhereInput[] | null;

  @Field(_type => EntityWhereInput, {
    nullable: true,
    description: undefined
  })
  entity: EntityWhereInput;
}
