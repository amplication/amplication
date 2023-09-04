import { InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class BuildUpdateInput {
  codeGeneratorVersion: string | null;
}
