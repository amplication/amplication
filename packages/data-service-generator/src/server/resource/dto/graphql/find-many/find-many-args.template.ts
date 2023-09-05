import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, ValidateNested } from "class-validator";

declare class WHERE_INPUT {}
declare class ORDER_BY_INPUT {}

@ArgsType()
export class ID {
  @ApiProperty({
    required: false,
    type: () => WHERE_INPUT,
  })
  @IsOptional()
  @ValidateNested()
  @Field(() => WHERE_INPUT, { nullable: true })
  @Type(() => WHERE_INPUT)
  where?: WHERE_INPUT;

  @ApiProperty({
    required: false,
    type: [ORDER_BY_INPUT],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Field(() => [ORDER_BY_INPUT], { nullable: true })
  @Type(() => ORDER_BY_INPUT)
  orderBy?: Array<ORDER_BY_INPUT>;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Field(() => Number, { nullable: true })
  @Type(() => Number)
  skip?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Field(() => Number, { nullable: true })
  @Type(() => Number)
  take?: number;
}
