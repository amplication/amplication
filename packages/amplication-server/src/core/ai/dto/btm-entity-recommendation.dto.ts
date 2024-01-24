import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class BtmEntityRecommendation {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => [String], {
    nullable: false,
    description: "The fields of the entity",
  })
  fields!: string[];

  @Field(() => String, {
    nullable: false,
    description: "The id of the original entity",
  })
  originalEntityId!: string;
}
