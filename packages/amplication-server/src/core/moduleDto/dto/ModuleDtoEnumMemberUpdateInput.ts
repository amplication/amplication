import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ModuleDtoEnumMemberUpdateInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  value!: string;
}
