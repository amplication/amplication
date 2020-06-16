import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './User'; // eslint-disable-line import/no-cycle
import { Role } from '../enums/Role';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class UserRole {
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

  user?: User;

  @Field(() => Role, {
    nullable: false,
    description: undefined
  })
  role!: string;
}
