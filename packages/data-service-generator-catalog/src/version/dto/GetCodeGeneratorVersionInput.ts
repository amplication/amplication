import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types";
import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

@InputType()
class GetCodeGeneratorVersionInput {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  codeGeneratorVersion?: string;

  @ApiProperty({
    required: true,
    enum: CodeGeneratorVersionStrategy,
  })
  @Field(() => CodeGeneratorVersionStrategy, { nullable: false })
  codeGeneratorStrategy!: CodeGeneratorVersionStrategy;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @Field(() => String)
  codeGeneratorFullName!: string;
}

registerEnumType(CodeGeneratorVersionStrategy, {
  name: "CodeGeneratorVersionStrategy",
});

export { GetCodeGeneratorVersionInput };
