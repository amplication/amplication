import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectorRestApiCreateInput } from './ConnectorRestApiCreateInput';

@ArgsType()
export class CreateConnectorRestApiArgs {
  @Field(() => ConnectorRestApiCreateInput, { nullable: false })
  data!: ConnectorRestApiCreateInput;
}
