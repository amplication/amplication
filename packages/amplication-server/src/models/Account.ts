import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./User";

@ObjectType({
  isAbstract: true,
})
export class Account {
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

  @Field(() => String, {
    nullable: false,
  })
  email!: string;

  @Field(() => String, {
    nullable: false,
  })
  firstName!: string;

  @Field(() => String, {
    nullable: false,
  })
  lastName!: string;

  @Field(() => String, {
    nullable: false,
  })
  password!: string;

  users?: User[] | null;

  currentUser?: User | null;

  @Field(() => String, {
    nullable: true,
  })
  githubId?: string | null;
}
