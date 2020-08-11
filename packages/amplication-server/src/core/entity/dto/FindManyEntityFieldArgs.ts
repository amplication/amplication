import { ArgsType, Field, Int } from '@nestjs/graphql';
import { EntityFieldOrderByInput } from '../../entityField/dto/EntityFieldOrderByInput';
import { EntityFieldWhereInput } from '../../entityField/dto/EntityFieldWhereInput';

@ArgsType()
export class FindManyEntityFieldArgs {
  @Field(() => EntityFieldWhereInput, { nullable: true })
  where?: EntityFieldWhereInput | null;

  @Field(() => EntityFieldOrderByInput, { nullable: true })
  orderBy?: EntityFieldOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
