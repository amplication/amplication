import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ResourceRelationUpdateInput {
  @Field(() => String, {
    nullable: false,
  })
  relationKey!: string;

  @Field(() => [String], {
    nullable: false,
  })
  relatedResources!: string[];
}
