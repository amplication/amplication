import { Field, InputType } from "@nestjs/graphql";
import { QueryMode } from "./QueryMode";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";

@InputType({
  isAbstract: true,
})
export class StringFilter {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  @Type(() => String)
  equals?: string;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @Field(() => [String], {
    nullable: true,
  })
  @Type(() => String)
  in?: string[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @Field(() => [String], {
    nullable: true,
  })
  @Type(() => String)
  notIn?: string[];

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  @Type(() => String)
  lt?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  @Type(() => String)
  lte?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  @Type(() => String)
  gt?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  @Type(() => String)
  gte?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  @Type(() => String)
  contains?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  @Type(() => String)
  startsWith?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  @Type(() => String)
  endsWith?: string;

  @ApiProperty({
    required: false,
    enum: ["Default", "Insensitive"],
  })
  @IsOptional()
  @Field(() => QueryMode, {
    nullable: true,
  })
  mode?: QueryMode;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  @Type(() => String)
  not?: string;
}
