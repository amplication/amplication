import { InterfaceType, Field } from '@nestjs/graphql';
import { IBlock } from 'src/models';

// Should extend IBlock in GraphQL, support for Type GraphQL has not arrived yet
@InterfaceType({})
export class EntityPage<T> extends IBlock {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  entityId!: string;

  settings: T;
}
