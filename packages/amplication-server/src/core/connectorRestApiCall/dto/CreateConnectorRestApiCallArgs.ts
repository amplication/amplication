import { ArgsType, Field } from '@nestjs/graphql';
import { ConnectorRestApiCallCreateInput } from './ConnectorRestApiCallCreateInput';

@ArgsType()
export class CreateConnectorRestApiCallArgs {
  @Field(() => ConnectorRestApiCallCreateInput, { nullable: false })
  data!: ConnectorRestApiCallCreateInput;
}
