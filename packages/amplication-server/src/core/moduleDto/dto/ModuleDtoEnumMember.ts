import { Field, InputType, ObjectType } from "@nestjs/graphql";
@InputType("ModuleDtoEnumMemberInput", {
  isAbstract: true,
})
@ObjectType({
  isAbstract: true,
})
export class ModuleDtoEnumMember {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  value!: string;
}
