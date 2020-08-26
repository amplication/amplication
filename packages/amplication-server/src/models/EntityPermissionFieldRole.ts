import { Field, ObjectType } from '@nestjs/graphql';
import { EntityPermissionField } from './EntityPermissionField'; // eslint-disable-line import/no-cycle
import { EntityPermissionRole } from './EntityPermissionRole'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class EntityPermissionFieldRole {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => String, {
    nullable: false
  })
  entityPermissionFieldId!: string;

  @Field(() => EntityPermissionField, {
    nullable: true
  })
  entityPermissionField?: EntityPermissionField;

  @Field(() => String, {
    nullable: false
  })
  entityPermissionRoleId!: string;

  @Field(() => EntityPermissionRole, {
    nullable: true
  })
  entityPermissionRole?: EntityPermissionRole;
}
