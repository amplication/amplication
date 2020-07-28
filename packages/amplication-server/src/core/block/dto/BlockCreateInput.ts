import { Field, InputType } from '@nestjs/graphql';
import { JsonObject, JsonArray, JsonValue } from 'type-fest';
import { WhereParentIdInput } from 'src/dto';
import { BlockInputOutput } from 'src/models';

@InputType({
  isAbstract: true,
  description: undefined
})
export abstract class BlockCreateInput implements JsonObject {
  [key: string]: JsonValue;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  description?: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
    description: undefined
  })
  app!: WhereParentIdInput & JsonValue;

  @Field(() => WhereParentIdInput, {
    nullable: true,
    description: undefined
  })
  parentBlock?: WhereParentIdInput & JsonValue;

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
