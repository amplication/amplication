import { Field, InputType } from '@nestjs/graphql';
import { JsonObject, JsonArray, JsonValue } from 'type-fest';
import { WhereParentIdInput } from 'src/dto';
import { BlockInputOutput } from 'src/models';

@InputType({
  isAbstract: true
})
export abstract class BlockCreateInput implements JsonObject {
  [key: string]: JsonValue;

  @Field(() => String, {
    nullable: false
  })
  displayName!: string;

  @Field(() => String, {
    nullable: true
  })
  description?: string;

  @Field(() => WhereParentIdInput, {
    nullable: false
  })
  resource!: WhereParentIdInput & JsonValue;

  @Field(() => WhereParentIdInput, {
    nullable: true
  })
  parentBlock?: WhereParentIdInput & JsonValue;

  @Field(() => [BlockInputOutput], {
    nullable: true
  })
  inputParameters?: BlockInputOutput[] & JsonArray;

  @Field(() => [BlockInputOutput], {
    nullable: true
  })
  outputParameters?: BlockInputOutput[] & JsonArray;
}
