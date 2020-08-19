import { Field, InputType } from '@nestjs/graphql';
import { EntityFieldPermissionWhereUniqueInput } from './EntityFieldPermissionWhereUniqueInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldUpdatePermissionsInput {
  @Field(() => [EntityFieldPermissionWhereUniqueInput], {
    nullable: true
  })
  remove?: EntityFieldPermissionWhereUniqueInput[] | null;

  @Field(() => [EntityFieldPermissionWhereUniqueInput], {
    nullable: true
  })
  add?: EntityFieldPermissionWhereUniqueInput[] | null;
}
