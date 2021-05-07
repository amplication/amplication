import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
@InputType({
  isAbstract: true,
  description: undefined,
})
export class BooleanFilter {
  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Field(() => Boolean, {
    nullable: true,
  })
  equals?: boolean;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Field(() => Boolean, {
    nullable: true,
  })
  not?: boolean;
}
