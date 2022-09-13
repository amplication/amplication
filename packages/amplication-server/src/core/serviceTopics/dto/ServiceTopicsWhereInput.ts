import { Field, InputType } from '@nestjs/graphql';
import { StringFilter } from 'src/dto';
import { BlockTypeWhereInput } from '../../block/dto';

@InputType({
  isAbstract: true
})
export class ServiceTopicsWhereInput extends BlockTypeWhereInput {
  @Field(() => StringFilter, {
    nullable: true
  })
  messageBrokerId?: StringFilter | null;
}
