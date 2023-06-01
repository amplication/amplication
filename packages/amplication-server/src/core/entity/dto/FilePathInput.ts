import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class FilePathInput {
  @Field(() => String, {
    nullable: false,
  })
  filePath!: string;
}
