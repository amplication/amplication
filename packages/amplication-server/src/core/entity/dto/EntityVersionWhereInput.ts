import { Field, InputType } from '@nestjs/graphql';
import {
  DateTimeFilter,
  StringFilter,
  IntFilter,
  WhereUniqueInput
} from 'src/dto';
import { EntityFieldFilter } from 'src/core/entityField/dto';

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

  @Field(_type => WhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  entity: WhereUniqueInput;
}
