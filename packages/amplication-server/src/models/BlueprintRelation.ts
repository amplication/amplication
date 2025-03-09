import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class BlueprintRelation {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  key!: string; // the relation key

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => String, {
    nullable: false,
  })
  relatedTo: string; //blueprint key

  @Field(() => Boolean, {
    nullable: false,
  })
  allowMultiple: boolean;

  @Field(() => Boolean, {
    nullable: false,
  })
  required: boolean;

  @Field(() => Boolean, {
    nullable: false,
  })
  limitSelectionToProject: boolean;

  @Field(() => Boolean, {
    nullable: false,
  })
  parentShouldBuildWithChild: boolean;
}
