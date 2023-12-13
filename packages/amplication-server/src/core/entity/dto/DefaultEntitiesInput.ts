import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class DefaultEntitiesInput {
  @Field(() => String, {
    nullable: false,
  })
  resourceId!: string;
}
