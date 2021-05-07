import { Field, InputType, Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class IntFilter {
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  equals?: number;

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @Field(() => [Int], {
    nullable: true,
  })
  in?: number[];

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @Field(() => [Int], {
    nullable: true,
  })
  notIn?: number[];

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  lt?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  lte?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  gt?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  gte?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Field(() => Int, {
    nullable: true,
  })
  not?: number;
}
