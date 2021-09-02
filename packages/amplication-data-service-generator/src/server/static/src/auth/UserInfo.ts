import { Field, ObjectType } from "@nestjs/graphql";
// @ts-ignore
// eslint-disable-next-line
import { User } from "../user/user";

@ObjectType()
export class UserInfo implements Partial<User> {
  @Field(() => String)
  username!: string;
  @Field(() => [String])
  roles!: string[];
  @Field(() => String)
  accessToken?: string;
}
