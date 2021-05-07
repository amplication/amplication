import { Field, InputType } from "@nestjs/graphql";
import { QueryMode } from "./QueryMode";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

@InputType({
  isAbstract: true,
})
export class StringNullableFilter {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  equals?: string | null;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @Field(() => [String], {
    nullable: true,
  })
  in?: string[] | null;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @Field(() => [String], {
    nullable: true,
  })
  notIn?: string[] | null;

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
    type: QueryMode,
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
  not?: string;
}
