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
import { StringFilter } from "../../util/StringFilter";
import { Type } from "class-transformer";
import { IsOptional, ValidateNested } from "class-validator";
import { ModelWhereUniqueInput } from "../../model/base/ModelWhereUniqueInput";
import { ConversationTypeListRelationFilter } from "../../conversationType/base/ConversationTypeListRelationFilter";
import { MessageListRelationFilter } from "../../message/base/MessageListRelationFilter";

@InputType()
class TemplateWhereInput {
  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  @Field(() => StringFilter, {
    nullable: true,
  })
  id?: StringFilter;

  @ApiProperty({
    required: false,
    type: () => ModelWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => ModelWhereUniqueInput)
  @IsOptional()
  @Field(() => ModelWhereUniqueInput, {
    nullable: true,
  })
  model?: ModelWhereUniqueInput;

  @ApiProperty({
    required: false,
    type: () => ConversationTypeListRelationFilter,
  })
  @ValidateNested()
  @Type(() => ConversationTypeListRelationFilter)
  @IsOptional()
  @Field(() => ConversationTypeListRelationFilter, {
    nullable: true,
  })
  messageTypes?: ConversationTypeListRelationFilter;

  @ApiProperty({
    required: false,
    type: () => MessageListRelationFilter,
  })
  @ValidateNested()
  @Type(() => MessageListRelationFilter)
  @IsOptional()
  @Field(() => MessageListRelationFilter, {
    nullable: true,
  })
  messages?: MessageListRelationFilter;
}

export { TemplateWhereInput as TemplateWhereInput };
