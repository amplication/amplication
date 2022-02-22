import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested, IsOptional } from "class-validator";

declare class WHERE_INPUT {}

@InputType()
class ID {
  @ApiProperty({
    required: false,
    type: () => WHERE_INPUT,
  })
  @ValidateNested()
  @Type(() => WHERE_INPUT)
  @IsOptional()
  @Field(() => WHERE_INPUT, {
    nullable: true,
  })
  every?: WHERE_INPUT;

  @ApiProperty({
    required: false,
    type: () => WHERE_INPUT,
  })
  @ValidateNested()
  @Type(() => WHERE_INPUT)
  @IsOptional()
  @Field(() => WHERE_INPUT, {
    nullable: true,
  })
  some?: WHERE_INPUT;

  @ApiProperty({
    required: false,
    type: () => WHERE_INPUT,
  })
  @ValidateNested()
  @Type(() => WHERE_INPUT)
  @IsOptional()
  @Field(() => WHERE_INPUT, {
    nullable: true,
  })
  none?: WHERE_INPUT;
}
