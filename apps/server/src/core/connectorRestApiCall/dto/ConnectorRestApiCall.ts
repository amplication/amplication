import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from '../../../models';

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
