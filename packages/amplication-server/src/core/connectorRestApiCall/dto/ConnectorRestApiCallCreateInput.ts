import { Field, InputType } from '@nestjs/graphql';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true
})
export class ConnectorRestApiCallCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false
  })
  url!: string;
}
