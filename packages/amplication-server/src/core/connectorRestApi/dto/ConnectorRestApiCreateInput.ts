import { Field, InputType } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto/index';
import { ConnectorRestApiSettings } from './ConnectorRestApiSettings';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiCreateInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  description?: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  app!: WhereParentIdInput;

  @Field(() => ConnectorRestApiSettings, {
    nullable: false,
    description: undefined
  })
  settings!: ConnectorRestApiSettings;
}
