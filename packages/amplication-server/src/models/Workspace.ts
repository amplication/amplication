import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './User'; // eslint-disable-line import/no-cycle
import { App } from './App'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Workspace {
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
  name!: string;

  @Field(() => [App])
  apps?: App[];

  @Field(() => [User])
  users?: User[];
}
