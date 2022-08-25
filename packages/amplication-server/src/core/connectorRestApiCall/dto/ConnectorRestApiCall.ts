import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';

@ObjectType({
  implements: IBlock,
  isAbstract: true
})
export class ConnectorRestApiCall extends IBlock {
  @Field(() => String, {
    nullable: false
  })
  url!: string;
}
