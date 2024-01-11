import { WhereParentIdInput } from "../../../dto";
import { BlockInputOutput } from "../../../models";
import { Field, InputType } from "@nestjs/graphql";
import type { JsonObject, JsonArray, JsonValue } from "type-fest";

@InputType({
  isAbstract: true,
})
export abstract class BlockCreateInput implements JsonObject {
  [key: string]: JsonValue;

  @Field(() => String, {
    nullable: false,
  })
  displayName!: string;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  resource!: WhereParentIdInput & JsonValue;

  @Field(() => WhereParentIdInput, {
    nullable: true,
  })
  parentBlock?: WhereParentIdInput & JsonValue;

  @Field(() => [BlockInputOutput], {
    nullable: true,
  })
  inputParameters?: BlockInputOutput[] & JsonArray;

  @Field(() => [BlockInputOutput], {
    nullable: true,
  })
  outputParameters?: BlockInputOutput[] & JsonArray;
}
