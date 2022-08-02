import { Field, ObjectType } from '@nestjs/graphql';
import { Resource } from './Resource'; // eslint-disable-line import/no-cycle
import { User } from './User'; // eslint-disable-line import/no-cycle
import { Build } from '../core/build/dto/Build'; // eslint-disable-line import/no-cycle
import { PendingChange } from '../core/resource/dto/PendingChange'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true
})
export class Commit {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => Date, {
    nullable: false
  })
  createdAt!: Date;

  resource?: Resource;

  @Field(() => String, {
    nullable: false
  })
  userId!: string;

  @Field(() => User, {
    nullable: true
  })
  user?: User;

  @Field(() => String, {
    nullable: false
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
