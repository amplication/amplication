import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";
@InputType({
  isAbstract: true,
  description: undefined,
})
export class DateTimeFilter {
  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  @Type(() => Date)
  equals?: Date;

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

  @ApiProperty({
    required: false,
    type: [Date],
  })
  @IsOptional()
  @Field(() => [Date], {
    nullable: true,
  })
  @Type(() => Date)
  in?: Date[];

  @ApiProperty({
    required: false,
    type: [Date],
  })
  @IsOptional()
  @Field(() => [Date], {
    nullable: true,
  })
  @Type(() => Date)
  notIn?: Date[];

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
}
