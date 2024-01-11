import { Role } from "../enums/Role";
import { User } from "./User";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class UserRole {
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

  user?: User;

  @Field(() => Role, {
    nullable: false,
  })
  role!: string;
}
