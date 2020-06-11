import { Field, ObjectType } from '@nestjs/graphql';
import { Block } from 'src/models/index';
import { ConnectorRestApiCallSettings } from './ConnectorRestApiCallSettings';

@ObjectType({
  implements: Block,
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiCall extends Block<ConnectorRestApiCallSettings> {
  // we need this in order to add GraphQL decorator on the actual type of settings
  @Field(() => ConnectorRestApiCallSettings, {
    nullable: true,
    description: undefined
  })
  settings?: ConnectorRestApiCallSettings;
}
