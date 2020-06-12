import { Field, InputType } from '@nestjs/graphql';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityPageCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  url!: string;
}
