import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';

@ObjectType({
  implements: IBlock,
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiCall extends IBlock {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  url!: string;
}
