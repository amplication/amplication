import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TrackBreakTheMonolith {
  @Field(() => Boolean, { nullable: false })
  success!: boolean;

  @Field(() => String, { nullable: true })
  message: string | null;
}
