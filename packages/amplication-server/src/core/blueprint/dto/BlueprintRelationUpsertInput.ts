import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class BlueprintRelationUpsertInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  key!: string;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => String, {
    nullable: false,
  })
  relatedTo!: string; //blueprint key

  @Field(() => Boolean, {
    nullable: false,
  })
  allowMultiple!: boolean;

  @Field(() => Boolean, {
    nullable: false,
  })
  required!: boolean;
}
