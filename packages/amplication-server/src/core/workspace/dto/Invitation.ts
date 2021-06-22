import { Field, ObjectType } from '@nestjs/graphql';
import { User, Workspace } from 'src/models'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Invitation {
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

  @Field(() => Workspace, {
    nullable: true,
    description: undefined
  })
  workspace?: Workspace;

  @Field(() => User, {
    nullable: true,
    description: undefined
  })
  invitedByUser?: User;
}
