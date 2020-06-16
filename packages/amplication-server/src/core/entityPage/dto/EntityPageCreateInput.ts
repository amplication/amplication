import { Field, InputType } from '@nestjs/graphql';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true
})
export class EntityPageCreateInput extends BlockCreateInput {
  @Field(() => String, {
    nullable: false
  })
  entityId!: string;
}
