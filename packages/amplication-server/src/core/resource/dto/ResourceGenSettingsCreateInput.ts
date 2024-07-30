import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ResourceGenSettingsCreateInput {
  @Field(() => Boolean, {
    nullable: false,
  })
  generateAdminUI!: boolean;

  @Field(() => Boolean, {
    nullable: false,
  })
  generateGraphQL!: boolean;

  @Field(() => Boolean, {
    nullable: false,
  })
  generateRestApi!: boolean;
}
