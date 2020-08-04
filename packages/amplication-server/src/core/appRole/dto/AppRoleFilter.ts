import { Field, InputType } from '@nestjs/graphql';
import { AppRoleWhereInput } from './AppRoleWhereInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class AppRoleFilter {
  @Field(() => AppRoleWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: AppRoleWhereInput | null;

  @Field(() => AppRoleWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: AppRoleWhereInput | null;

  @Field(() => AppRoleWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: AppRoleWhereInput | null;
}
