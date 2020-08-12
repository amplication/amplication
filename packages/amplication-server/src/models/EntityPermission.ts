import { Field, ObjectType } from '@nestjs/graphql';
import { EntityVersion } from './EntityVersion'; // eslint-disable-line import/no-cycle
import { AppRole } from './AppRole'; // eslint-disable-line import/no-cycle
import { EnumEntityAction } from './../enums/EnumEntityAction';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class EntityPermission {
  entityVersion?: EntityVersion;

  @Field(() => EnumEntityAction, {
    nullable: false
  })
  action!: keyof typeof EnumEntityAction;

  @Field(() => AppRole, {
    nullable: false
  })
  appRole!: AppRole;
}
