import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
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
  equals?: Date | null;

  @ApiProperty({
    required: false,
    type: [Date],
  })
  @IsOptional()
  @Field(() => [Date], {
    nullable: true,
  })
  in?: Date[] | null;

  @ApiProperty({
    required: false,
    type: [Date],
  })
  @IsOptional()
  @Field(() => [Date], {
    nullable: true,
  })
  notIn?: Date[] | null;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  lt?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  lte?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  gt?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  gte?: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  not?: Date;
}
