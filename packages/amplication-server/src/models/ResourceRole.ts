import { Resource } from "./Resource";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class ResourceRole {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
  })
  updatedAt!: Date;

  resource?: Resource;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  displayName!: string;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;
}
