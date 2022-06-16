import { Field, InputType, Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class IntNullableFilter {
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  @Type(() => Number)
  equals?: number | null;

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @Field(() => [Int], {
    nullable: true,
  })
  @Type(() => Number)
  in?: number[] | null;

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @Field(() => [Int], {
    nullable: true,
  })
  @Type(() => Number)
  notIn?: number[] | null;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  @Type(() => Number)
  lt?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  @Type(() => Number)
  lte?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  @Type(() => Number)
  gt?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  @Type(() => Number)
  gte?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  @Type(() => Number)
  not?: number;
}
