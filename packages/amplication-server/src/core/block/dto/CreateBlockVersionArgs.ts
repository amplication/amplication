import { ArgsType, Field } from '@nestjs/graphql';
import { BlockVersionCreateInput } from './';

@ArgsType()
export class CreateBlockVersionArgs {
  @Field(() => BlockVersionCreateInput, { nullable: false })
  data!: BlockVersionCreateInput;
}
