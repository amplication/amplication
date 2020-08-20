import { Field, ObjectType } from '@nestjs/graphql';
import { EntityVersion } from './EntityVersion'; // eslint-disable-line import/no-cycle
import { EnumEntityAction } from './../enums/EnumEntityAction';
import { EnumEntityPermissionType } from './../enums/EnumEntityPermissionType';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class EntityPermission {
  @Field(() => String, {
    nullable: false
  })
  entityVersionId!: string;

  @Field(() => EntityVersion, {
    nullable: true
  })
  entityVersion?: EntityVersion;

  @Field(() => EnumEntityAction, {
    nullable: false
  })
  action!: keyof typeof EnumEntityAction;

  @Field(() => EnumEntityPermissionType, {
    nullable: false
  })
  type!: keyof typeof EnumEntityPermissionType;
}
