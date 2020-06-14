import { Field, InputType } from '@nestjs/graphql';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiCallCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  url!: string;
}
