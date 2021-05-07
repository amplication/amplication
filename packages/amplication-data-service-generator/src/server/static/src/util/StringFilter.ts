import { Field, InputType } from "@nestjs/graphql";
import { QueryMode } from "./QueryMode";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

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
  equals?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  not?: string;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @Field(() => [String], {
    nullable: true,
  })
  in?: string[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @Field(() => [String], {
    nullable: true,
  })
  notIn?: string[];

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  lt?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  lte?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  gt?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  gte?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  contains?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  startsWith?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
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
}
