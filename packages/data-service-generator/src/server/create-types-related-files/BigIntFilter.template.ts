import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { GraphQLBigInt } from "./GraphQLBigInt";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class BigIntFilter {
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  @Type(() => Number)
  equals?: bigint;

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @Field(() => [GraphQLBigInt], {
    nullable: true,
  })
  @Type(() => Number)
  in?: bigint[];

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @Field(() => [GraphQLBigInt], {
    nullable: true,
  })
  @Type(() => Number)
  notIn?: bigint[];

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  @Type(() => Number)
  lt?: bigint;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  @Type(() => Number)
  lte?: bigint;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  @Type(() => Number)
  gt?: bigint;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  @Type(() => Number)
  gte?: bigint;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => GraphQLBigInt, {
    nullable: true,
  })
  @Type(() => Number)
  not?: bigint;
}
