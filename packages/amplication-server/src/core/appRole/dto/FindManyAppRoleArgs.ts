import { ArgsType, Field, Int } from '@nestjs/graphql';
import { AppRoleOrderByInput } from './AppRoleOrderByInput';
import { AppRoleWhereInput } from './AppRoleWhereInput';

@ArgsType()
export class FindManyAppRoleArgs {
  @Field(() => AppRoleWhereInput, { nullable: true })
  where?: AppRoleWhereInput | null;

  @Field(() => AppRoleOrderByInput, { nullable: true })
  orderBy?: AppRoleOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
