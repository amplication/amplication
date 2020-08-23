import { Field, InputType } from '@nestjs/graphql';
import { EnumEntityAction } from 'src/enums/EnumEntityAction';
import { EnumEntityPermissionType } from 'src/enums/EnumEntityPermissionType';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityUpdatePermissionInput {
  @Field(() => EnumEntityAction, { nullable: false })
  action!: EnumEntityAction;

  @Field(() => EnumEntityPermissionType, { nullable: false })
  type!: EnumEntityPermissionType;
}
