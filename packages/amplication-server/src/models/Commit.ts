import { Field, ObjectType } from '@nestjs/graphql';
import { Resource } from './Resource'; // eslint-disable-line import/no-cycle
import { User } from './User'; // eslint-disable-line import/no-cycle
import { Build } from '../core/build/dto/Build'; // eslint-disable-line import/no-cycle
import { PendingChange } from '../core/resource/dto/PendingChange'; // eslint-disable-line import/no-cycle

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

  resource?: Resource;

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

  @Field(() => [Build], {
    nullable: true
  })
  builds?: Build[] | null;

  @Field(() => [PendingChange], {
    nullable: true
  })
  changes?: PendingChange[] | null;
}
