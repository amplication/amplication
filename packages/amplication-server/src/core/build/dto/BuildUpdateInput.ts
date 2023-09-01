import { InputType, Field } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class BuildUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  codeGeneratorVersion: string | null;
}
