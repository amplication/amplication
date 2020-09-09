import { Field, ObjectType } from '@nestjs/graphql';
import { EntityPermission } from './EntityPermission'; // eslint-disable-line import/no-cycle
import { AppRole } from './AppRole'; // eslint-disable-line import/no-cycle
import { EnumEntityAction } from 'src/enums/EnumEntityAction';

/**
 * Connecting {@codelink EntityPermission} to {@codelink AppRole}.
 * Defines an ID so fields EntityPermissionRole can link to it.
 */
@ObjectType({
  isAbstract: true,
  description: undefined
})
export class EntityPermissionRole {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => String, {
    nullable: false
  })
  entityVersionId!: string;

  @Field(() => EnumEntityAction, {
    nullable: false
  })
  action!: keyof typeof EnumEntityAction;

  @Field(() => EntityPermission, {
    nullable: true
  })
  entityPermission?: EntityPermission;

  @Field(() => String, {
    nullable: false
  })
  appRoleId!: string;

  @Field(() => AppRole, {
    nullable: false
  })
  appRole: AppRole;
}
