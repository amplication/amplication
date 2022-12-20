import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../user/base/User";

declare class USER_ID_TYPE_ANNOTATION {}
declare class USER_ID_CLASS {}

@ObjectType()
export class UserInfo implements Partial<User> {
  @Field(() => USER_ID_CLASS)
  id!: USER_ID_TYPE_ANNOTATION;
  @Field(() => String)
  username!: string;
  @Field(() => [String])
  roles!: string[];
  @Field(() => String, { nullable: true })
  accessToken?: string;
}
