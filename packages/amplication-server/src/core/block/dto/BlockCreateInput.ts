import { Field, InputType } from '@nestjs/graphql';
import { JsonObject, JsonArray } from 'type-fest';
import { WhereParentIdInput } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockInputOutput } from 'src/models';

@InputType({
  isAbstract: true,
  description: undefined
})
export class BlockCreateInput<T> {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  description?: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  app!: WhereParentIdInput;

  @Field(() => WhereParentIdInput, {
    nullable: true,
    description: undefined
  })
  parentBlock?: WhereParentIdInput;

  blockType!: keyof typeof EnumBlockType;

  settings: T & JsonObject;

  @Field(() => [BlockInputOutput], {
    nullable: true,
    description: undefined
  })
  inputParameters?: BlockInputOutput[] & JsonArray;

  @Field(() => [BlockInputOutput], {
    nullable: true,
    description: undefined
  })
  outputParameters?: BlockInputOutput[] & JsonArray;
}
