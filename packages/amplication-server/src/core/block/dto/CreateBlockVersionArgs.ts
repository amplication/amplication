import { ArgsType, Field } from '@nestjs/graphql';
import { BlockVersionCreateInput } from './BlockVersionCreateInput';

@ArgsType()
export class CreateBlockVersionArgs {
  @Field(() => BlockVersionCreateInput, { nullable: false })
  data!: BlockVersionCreateInput;
}
