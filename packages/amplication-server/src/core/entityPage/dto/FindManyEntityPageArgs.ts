import { ArgsType, Field, Int } from '@nestjs/graphql';
import { EntityPageOrderByInput, EntityPageWhereInput } from './';

@ArgsType()
export class FindManyEntityPageArgs {
  @Field(() => EntityPageWhereInput, { nullable: true })
  where?: EntityPageWhereInput | null;

  @Field(() => EntityPageOrderByInput, { nullable: true })
  orderBy?: EntityPageOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
