import { Field, InputType } from '@nestjs/graphql';
import { EnumEntityAction } from 'src/enums/EnumEntityAction';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityPermissionWhereUniqueInput {
  @Field(() => EnumEntityAction, {
    nullable: false
  })
  action!: keyof typeof EnumEntityAction;

  @Field(() => String, {
    nullable: false
  })
  appRoleId!: string;
}
