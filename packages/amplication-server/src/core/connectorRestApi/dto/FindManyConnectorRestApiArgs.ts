import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ConnectorRestApiOrderByInput } from './ConnectorRestApiOrderByInput';
import { ConnectorRestApiWhereInput } from './ConnectorRestApiWhereInput';

@ArgsType()
export class FindManyConnectorRestApiArgs {
  @Field(() => ConnectorRestApiWhereInput, { nullable: true })
  where?: ConnectorRestApiWhereInput | null;

  @Field(() => ConnectorRestApiOrderByInput, { nullable: true })
  orderBy?: ConnectorRestApiOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
