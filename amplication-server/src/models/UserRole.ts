import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./User";
import { Role  } from "../enums/Role";


@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class UserRole {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  id!: string;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  createdAt!: Date;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  updatedAt!: Date;

  user?: User;

  @Field(_type => Role, {
    nullable: false,
    description: undefined,
  })
  role!: string;
}
