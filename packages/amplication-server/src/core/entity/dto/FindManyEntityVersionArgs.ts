import { ArgsType, Field, Int } from '@nestjs/graphql';
import { EntityVersionOrderByInput } from './EntityVersionOrderByInput';
import { EntityVersionWhereInput } from './EntityVersionWhereInput';

@ArgsType()
export class FindManyEntityVersionArgs {
  @Field(() => EntityVersionWhereInput, { nullable: true })
  where?: EntityVersionWhereInput | null;

  @Field(() => EntityVersionOrderByInput, { nullable: true })
  orderBy?: EntityVersionOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
