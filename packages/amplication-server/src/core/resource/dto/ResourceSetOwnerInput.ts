import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ResourceSetOwnerInput {
  @Field(() => String, {
    nullable: false,
  })
  resourceId!: string;

  @Field(() => String, {
    nullable: true,
  })
  userId?: string;

  @Field(() => String, {
    nullable: true,
  })
  teamId?: string;
}
