import { Field, InputType, ObjectType } from "@nestjs/graphql";
@InputType("PackageFileInput", {
  isAbstract: true,
})
@ObjectType({
  isAbstract: true,
})
export class PackageFile {
  @Field(() => String, {
    nullable: false,
  })
  path!: string;

  @Field(() => String, {
    nullable: false,
  })
  content!: string;
}
