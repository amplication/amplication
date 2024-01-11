import { CodeGeneratorVersionOptionsInput } from "./CodeGeneratorVersionOptionsInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CodeGeneratorVersionUpdateInput {
  @Field(() => CodeGeneratorVersionOptionsInput, {
    nullable: false,
  })
  codeGeneratorVersionOptions!: CodeGeneratorVersionOptionsInput;
}
