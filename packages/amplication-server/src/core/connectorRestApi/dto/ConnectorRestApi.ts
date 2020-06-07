import { Field, ObjectType } from '@nestjs/graphql';
import { App, Block } from 'src/models/index';
import { ConnectorRestApiSettings } from './ConnectorRestApiSettings';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApi extends Block<ConnectorRestApiSettings> {
  // constructor(block?: Block) {
  //   if (block) {
  //     Object.assign(this, block);
  //     // this.id = block.id;
  //     // this.createdAt = block.createdAt;
  //     // this.updatedAt = block.updatedAt;
  //     // this.app = block.app;
  //     // this.name = block.name;
  //     // this.description = block.description;
  //     this.settings = block.configuration
  //       ? JSON.parse(block.configuration)
  //       : null;
  //   }
  // }

  // we need this in order to add GraphQL decorator on the actual type of settings
  @Field(() => ConnectorRestApiSettings, {
    nullable: true,
    description: undefined
  })
  settings?: ConnectorRestApiSettings;
}
