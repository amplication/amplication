import { Field, ObjectType } from '@nestjs/graphql';
import { App, Block } from 'src/models';
import { ConnectorRestApiSettings } from './ConnectorRestApiSettings';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApi {
  constructor(block?: Block) {
    if (block) {
      this.id = block.id;
      this.createdAt = block.createdAt;
      this.updatedAt = block.updatedAt;
      this.app = block.app;
      this.name = block.name;
      this.description = block.description;
      this.settings = JSON.parse(block.configuration);
    }
  }

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  app?: App;

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

  @Field(() => ConnectorRestApiSettings, {
    nullable: true,
    description: undefined
  })
  settings: ConnectorRestApiSettings;
}
