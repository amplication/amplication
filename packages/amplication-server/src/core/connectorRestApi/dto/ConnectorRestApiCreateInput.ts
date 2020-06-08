import { Field, InputType } from '@nestjs/graphql';
import { JsonObject } from 'type-fest';
import { ConnectorRestApiSettings } from './ConnectorRestApiSettings';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiCreateInput extends BlockCreateInput<
  ConnectorRestApiSettings
> {
  // we need this in order to add GraphQL decorator on the actual type of settings
  @Field(() => ConnectorRestApiSettings, {
    nullable: false,
    description: undefined
  })
  settings!: ConnectorRestApiSettings & JsonObject;
}
