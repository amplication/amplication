import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./User";
import { EnumRole } from "../enums/EnumRole";

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

  @Field(() => EnumRole, {
    nullable: false,
  })
  role!: string;
}
