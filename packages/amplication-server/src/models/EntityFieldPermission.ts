import { Field, ObjectType } from '@nestjs/graphql';
import { EntityField } from './EntityField'; // eslint-disable-line import/no-cycle
import { AppRole } from './AppRole'; // eslint-disable-line import/no-cycle
import { EnumEntityFieldAction } from './../enums/EnumEntityFieldAction';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldPermission {
  @Field(() => String, {
    nullable: false
  })
  entityFieldId!: string;

  @Field(() => EntityField, {
    nullable: true
  })
  entityField?: EntityField;

  @Field(() => EnumEntityFieldAction, {
    nullable: false
  })
  action!: keyof typeof EnumEntityFieldAction;

  @Field(() => String, {
    nullable: false
  })
  appRoleId!: string;

  @Field(() => AppRole, {
    nullable: true
  })
  appRole?: AppRole;
}
