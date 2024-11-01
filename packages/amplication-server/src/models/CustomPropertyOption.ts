import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class CustomPropertyOption {
  @Field(() => String, {
    nullable: false,
  })
  value!: string;

  @Field(() => String, {
    nullable: false,
  })
  color!: string;
}
