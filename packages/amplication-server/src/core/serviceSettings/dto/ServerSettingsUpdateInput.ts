import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ServerSettingsUpdateInput {
  @Field(() => Boolean, {
    nullable: true,
  })
  generateGraphQL?: boolean;

  @Field(() => Boolean, {
    nullable: true,
  })
  generateRestApi?: boolean;

  @Field(() => String, {
    nullable: true,
  })
  serverPath?: string;
}
