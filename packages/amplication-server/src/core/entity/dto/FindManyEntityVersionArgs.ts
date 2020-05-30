import { ArgsType, Field, Int } from '@nestjs/graphql';
import { EntityVersionOrderByInput } from './';
import { EntityVersionWhereInput } from './';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class FindManyEntityVersionArgs {
  @Field(_type => EntityVersionWhereInput, { nullable: true })
  where?: EntityVersionWhereInput | null;

  @Field(_type => EntityVersionOrderByInput, { nullable: true })
  orderBy?: EntityVersionOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;
}
