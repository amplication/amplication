import { Field, InputType, Float } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { Decimal } from "decimal.js";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DecimalFilter {
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  @Type(() => Number)
  equals?: Decimal;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => [Float], {
    nullable: true,
  })
  @Type(() => Number)
  in?: Decimal[];

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @Field(() => [Float], {
    nullable: true,
  })
  @Type(() => Number)
  notIn?: Decimal[];

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  @Type(() => Number)
  lt?: Decimal;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  @Type(() => Number)
  lte?: Decimal;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  @Type(() => Number)
  gt?: Decimal;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  @Type(() => Number)
  gte?: Decimal;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  @Type(() => Number)
  not?: Decimal;
}
