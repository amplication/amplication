import {Field,  ObjectType } from "@nestjs/graphql";
import { User } from "./";



@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Account   { // 
 
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

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  email!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  firstName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  lastName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  password!: string;

  users?: User[] | null;

  currentUser?: User | null;
}



