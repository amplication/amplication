import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { Decimal } from "decimal.js";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DecimalNullableFilter {
  @ApiProperty({
    required: false,
    type: Decimal,
  })
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  @Type(() => Decimal)
  equals?: Decimal | null;

  @ApiProperty({
    required: false,
    type: [Decimal],
  })
  @IsOptional()
  @Field(() => [Number], {
    nullable: true,
  })
  @Type(() => Number)
  in?: Decimal[] | null;

  @ApiProperty({
    required: false,
    type: [Decimal],
  })
  @IsOptional()
  @Field(() => [Number], {
    nullable: true,
  })
  @Type(() => Decimal)
  notIn?: Decimal[] | null;

  @ApiProperty({
    required: false,
    type: Decimal,
  })
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  @Type(() => Decimal)
  lt?: Decimal;

  @ApiProperty({
    required: false,
    type: Decimal,
  })
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  @Type(() => Decimal)
  lte?: Decimal;

  @ApiProperty({
    required: false,
    type: Decimal,
  })
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  @Type(() => Decimal)
  gt?: Decimal;

  @ApiProperty({
    required: false,
    type: Decimal,
  })
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  @Type(() => Decimal)
  gte?: Decimal;

  @ApiProperty({
    required: false,
    type: Decimal,
  })
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  @Type(() => Decimal)
  not?: Decimal;
}
