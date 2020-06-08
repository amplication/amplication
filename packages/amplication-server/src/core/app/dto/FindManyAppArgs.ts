import { ArgsType, Field, Int } from '@nestjs/graphql';
import { AppOrderByInput } from './';
import { AppWhereInput } from './';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class FindManyAppArgs {
  @Field(_type => AppWhereInput, { nullable: true })
  where?: AppWhereInput | null;

  @Field(_type => AppOrderByInput, { nullable: true })
  orderBy?: AppOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => Int, { nullable: true })
  take?: number | null;
}
