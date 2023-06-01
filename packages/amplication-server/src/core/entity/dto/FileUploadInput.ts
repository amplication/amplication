import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class FileUploadInput {
  @Field(() => String, {
    nullable: false,
  })
  filePath!: string;

  @Field(() => String, {
    nullable: false,
  })
  resourceId!: string;
}
