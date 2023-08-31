/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { VersionCreateInput } from "./VersionCreateInput";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@ArgsType()
class CreateVersionArgs {
  @ApiProperty({
    required: true,
    type: () => VersionCreateInput,
  })
  @ValidateNested()
  @Type(() => VersionCreateInput)
  @Field(() => VersionCreateInput, { nullable: false })
  data!: VersionCreateInput;
}

export { CreateVersionArgs as CreateVersionArgs };
