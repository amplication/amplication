import { ArgsType, Field } from '@nestjs/graphql';
import { EntityPermissionFieldWhereUniqueInput } from './EntityPermissionFieldWhereUniqueInput';

@ArgsType()
export class DeleteEntityPermissionFieldArgs {
  @Field(() => EntityPermissionFieldWhereUniqueInput, { nullable: false })
  where!: EntityPermissionFieldWhereUniqueInput;
}
