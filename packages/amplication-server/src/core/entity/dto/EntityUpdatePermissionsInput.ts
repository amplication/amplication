import { Field, InputType } from '@nestjs/graphql';
import { EntityPermissionWhereUniqueInput } from './EntityPermissionWhereUniqueInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityUpdatePermissionsInput {
  @Field(() => [EntityPermissionWhereUniqueInput], {
    nullable: true
  })
  removePermissions?: EntityPermissionWhereUniqueInput[] | null;

  @Field(() => [EntityPermissionWhereUniqueInput], {
    nullable: true
  })
  addPermissions?: EntityPermissionWhereUniqueInput[] | null;
}
