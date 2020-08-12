import { Field, ObjectType } from '@nestjs/graphql';
import { App } from './App'; // eslint-disable-line import/no-cycle
import { User } from './User'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Commit {
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

  App?: App;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  userId!: string;

  @Field(() => User, {
    nullable: true,
    description: undefined
  })
  user?: User;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  message!: string;
}
