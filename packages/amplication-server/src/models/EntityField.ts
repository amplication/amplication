import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { JsonValue } from 'type-fest';
import { EntityVersion } from './EntityVersion'; // eslint-disable-line import/no-cycle
import { EnumDataType } from './../enums/EnumDataType';

@ObjectType({
  isAbstract: true
})
export class EntityField {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => String, {
    nullable: false
  })
  permanentId!: string;

  @Field(() => Date, {
    nullable: false
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false
  })
  updatedAt!: Date;

  entityVersionId?: string;

  entityVersion?: EntityVersion;

  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: false
  })
  displayName!: string;

  @Field(() => EnumDataType, {
    nullable: false
  })
  dataType!: keyof typeof EnumDataType;

  @Field(() => GraphQLJSONObject, {
    nullable: true
  })
  properties!: JsonValue;

  @Field(() => Boolean, {
    nullable: false
  })
  required!: boolean;

  @Field(() => Boolean, {
    nullable: false
  })
  unique!: boolean;

  @Field(() => Boolean, {
    nullable: false
  })
  searchable!: boolean;

  @Field(() => String, {
    nullable: true
  })
  description: string;

  @Field(() => Int, {
    nullable: true
  })
  position?: number;
}
