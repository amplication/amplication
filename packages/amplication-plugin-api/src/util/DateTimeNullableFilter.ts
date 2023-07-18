import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";
@InputType({
  isAbstract: true,
  description: undefined,
})
export class DateTimeNullableFilter {
  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  @Type(() => Date)
  equals?: Date | null;

  @ApiProperty({
    required: false,
    type: [Date],
  })
  @IsOptional()
  @Field(() => [Date], {
    nullable: true,
  })
  @Type(() => Date)
  in?: Date[] | null;

  @ApiProperty({
    required: false,
    type: [Date],
  })
  @IsOptional()
  @Field(() => [Date], {
    nullable: true,
  })
  @Type(() => Date)
  notIn?: Date[] | null;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  @Type(() => Date)
  lt?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  @Type(() => Date)
  lte?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  @Type(() => Date)
  gt?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  @Type(() => Date)
  gte?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  @Type(() => Date)
  not?: Date;
}
