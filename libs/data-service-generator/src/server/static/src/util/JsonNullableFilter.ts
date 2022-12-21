import type { JsonValue } from "type-fest";
import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class JsonNullableFilter {
  @ApiProperty({
    required: false,
    type: GraphQLJSONObject,
  })
  @IsOptional()
  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  equals?: JsonValue;

  @ApiProperty({
    required: false,
    type: GraphQLJSONObject,
  })
  @IsOptional()
  @Field(() => GraphQLJSONObject, {
    nullable: true,
  })
  not?: JsonValue;
}
