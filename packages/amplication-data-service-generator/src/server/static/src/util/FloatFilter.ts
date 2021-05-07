import { Field, InputType, Float } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class FloatFilter {
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  equals?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => [Float], {
    nullable: true,
  })
  in?: number[];

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @Field(() => [Float], {
    nullable: true,
  })
  notIn?: number[];

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  lt?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  lte?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  gt?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  gte?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Float, {
    nullable: true,
  })
  not?: number;
}
