import { Field, InputType } from '@nestjs/graphql';
import { EnumEntityAction } from 'src/enums/EnumEntityAction';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityPermissionRoleWhereUniqueInput {
  entityId: string;
  @Field(() => String, {
    nullable: false
  })
  @Field(() => EnumEntityAction, {
    nullable: false
  })
  action!: keyof typeof EnumEntityAction;

  @Field(() => String, {
    nullable: false
  })
  appRoleId!: string;
}
