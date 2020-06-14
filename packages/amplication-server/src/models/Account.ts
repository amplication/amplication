import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Account {
  //

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  email!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  firstName!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  lastName!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  password!: string;

  users?: User[] | null;

  currentUser?: User | null;
}
