import { Field, InputType } from "@nestjs/graphql";
import { CodeGeneratorVersionOptionsInput } from "./CodeGeneratorVersionOptionsInput";

@InputType({
  isAbstract: true,
})
export class CodeGeneratorVersionUpdateInput {
  @Field(() => CodeGeneratorVersionOptionsInput, {
    nullable: false,
  })
  codeGeneratorVersionOptions!: CodeGeneratorVersionOptionsInput;
}
