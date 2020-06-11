import { Field, InputType } from '@nestjs/graphql';
import { JsonObject } from 'type-fest';
import { ConnectorRestApiCallSettings } from './ConnectorRestApiCallSettings';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiCallCreateInput extends BlockCreateInput<
  ConnectorRestApiCallSettings
> {
  // we need this in order to add GraphQL decorator on the actual type of settings
  @Field(() => ConnectorRestApiCallSettings, {
    nullable: false,
    description: undefined
  })
  settings!: ConnectorRestApiCallSettings & JsonObject;
}
