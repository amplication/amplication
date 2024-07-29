/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  MaxLength,
  IsInt,
  Max,
  IsOptional,
  IsEnum,
  ValidateNested,
} from "class-validator";
import { EnumMessageRole } from "./EnumMessageRole";
import { TemplateWhereUniqueInput } from "../../template/base/TemplateWhereUniqueInput";
import { Type } from "class-transformer";

@InputType()
class MessageCreateInput {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @MaxLength(256)
  @Field(() => String)
  content!: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsInt()
  @Max(99999999999)
  @IsOptional()
  @Field(() => Number, {
    nullable: true,
  })
  position?: number | null;

  @ApiProperty({
    required: true,
    enum: EnumMessageRole,
  })
  @IsEnum(EnumMessageRole)
  @Field(() => EnumMessageRole)
  role!: "User" | "System" | "Assistant";

  @ApiProperty({
    required: false,
    type: () => TemplateWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => TemplateWhereUniqueInput)
  @IsOptional()
  @Field(() => TemplateWhereUniqueInput, {
    nullable: true,
  })
  template?: TemplateWhereUniqueInput | null;
}

export { MessageCreateInput as MessageCreateInput };
