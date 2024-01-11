import { User } from "../user/base/User";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserInfo implements Partial<User> {
  @Field(() => String)
  id!: string;
  @Field(() => String)
  username!: string;
  @Field(() => [String])
  roles!: string[];
  @Field(() => String, { nullable: true })
  accessToken?: string;
}
