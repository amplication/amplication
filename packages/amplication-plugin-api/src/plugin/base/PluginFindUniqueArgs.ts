/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { PluginWhereUniqueInput } from "./PluginWhereUniqueInput";
import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

@ArgsType()
class PluginFindUniqueArgs {
  @ApiProperty({
    required: true,
    type: () => PluginWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => PluginWhereUniqueInput)
  @Field(() => PluginWhereUniqueInput, { nullable: false })
  where!: PluginWhereUniqueInput;
}

export { PluginFindUniqueArgs as PluginFindUniqueArgs };
