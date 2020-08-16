import { Field, ObjectType } from '@nestjs/graphql';
import { EntityVersion } from './EntityVersion'; // eslint-disable-line import/no-cycle
import { AppRole } from './AppRole'; // eslint-disable-line import/no-cycle
import { EnumEntityAction } from './../enums/EnumEntityAction';

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

  @Field(() => String, {
    nullable: false
  })
  appRoleId!: string;

  @Field(() => AppRole, {
    nullable: true
  })
  appRole?: AppRole;
}
