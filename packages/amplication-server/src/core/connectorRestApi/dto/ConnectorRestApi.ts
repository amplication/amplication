import { Field, ObjectType } from '@nestjs/graphql';
import { Block } from 'src/models/index';
import { ConnectorRestApiSettings } from './ConnectorRestApiSettings';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApi extends Block<ConnectorRestApiSettings> {
  // we need this in order to add GraphQL decorator on the actual type of settings
  @Field(() => ConnectorRestApiSettings, {
    nullable: true,
    description: undefined
  })
  settings?: ConnectorRestApiSettings;
}
