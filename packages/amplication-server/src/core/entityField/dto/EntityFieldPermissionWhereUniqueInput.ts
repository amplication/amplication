import { Field, InputType } from '@nestjs/graphql';
import { EnumEntityFieldAction } from 'src/enums/EnumEntityFieldAction';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldPermissionWhereUniqueInput {
  @Field(() => EnumEntityFieldAction, {
    nullable: false
  })
  action!: keyof typeof EnumEntityFieldAction;

  @Field(() => String, {
    nullable: false
  })
  appRoleId!: string;
}
