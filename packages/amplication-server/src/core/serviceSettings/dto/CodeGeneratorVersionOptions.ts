import { Field, ObjectType } from "@nestjs/graphql";
import { CodeGeneratorVersionStrategy } from "./EnumCodeGeneratorVersionStrategy";

@ObjectType({
  isAbstract: true,
})
export class CodeGeneratorVersionOptions {
  @Field(() => String, {
    nullable: true,
  })
  version?: string;

  @Field(() => CodeGeneratorVersionStrategy, {
    nullable: true,
  })
  selectionStrategy?: CodeGeneratorVersionStrategy;
}
