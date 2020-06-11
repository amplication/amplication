import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity } from '../models/Entity';
import { EntityField } from '../models/EntityField';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class EntityVersion {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  entity?: Entity;

  @Field(() => Int, {
    nullable: false,
    description: undefined
  })
  versionNumber!: number;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  label!: string;

  entityFields?: EntityField[] | null;
}
