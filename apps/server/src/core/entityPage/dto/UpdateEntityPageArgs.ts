import { ArgsType, Field } from '@nestjs/graphql';
import { UpdateBlockArgs } from '../../block/dto/UpdateBlockArgs';
import { EntityPageUpdateInput } from './EntityPageUpdateInput';

@ArgsType()
export class UpdateEntityPageArgs extends UpdateBlockArgs {
  @Field(() => EntityPageUpdateInput, { nullable: false })
  data!: EntityPageUpdateInput;
}
