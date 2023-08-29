import { Field, InputType, Int } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class PluginSetOrderInput {
  @Field(() => Int, {
    nullable: false,
  })
  order!: number;
}
