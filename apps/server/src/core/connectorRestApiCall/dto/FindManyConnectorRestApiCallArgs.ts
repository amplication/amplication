import { ArgsType, Field, Int } from '@nestjs/graphql';
import { ConnectorRestApiCallOrderByInput } from './ConnectorRestApiCallOrderByInput';
import { ConnectorRestApiCallWhereInput } from './ConnectorRestApiCallWhereInput';

@ArgsType()
export class FindManyConnectorRestApiCallArgs {
  @Field(() => ConnectorRestApiCallWhereInput, { nullable: true })
  where?: ConnectorRestApiCallWhereInput | null;

  @Field(() => ConnectorRestApiCallOrderByInput, { nullable: true })
  orderBy?: ConnectorRestApiCallOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
