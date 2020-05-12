import { Field, ObjectType } from '@nestjs/graphql';
import { EntityVersion, EntityField } from './';
import { App } from './App';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Entity {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(_type => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(_type => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  App?: App;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  pluralDisplayName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  description!: string;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined
  })
  isPersistent!: boolean;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined
  })
  allowFeedback!: boolean;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  primaryField!: string;

  entityVersions?: EntityVersion[] | null;

  @Field(_type => [EntityField], {
    nullable: false,
    description: undefined
  })
  entityFields?: EntityField[] | null;

  @Field(_type => Number, {
    nullable: true,
    description: undefined
  })
  versionNumber?: number;
}
