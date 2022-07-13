import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './User'; // eslint-disable-line import/no-cycle
import { GitOrganization } from './GitOrganization';
import { Project } from './Project'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true
})
export class Workspace {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => Date, {
    nullable: false
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => [Project])
  projects?: Project[];

  @Field(() => [GitOrganization], { nullable: true })
  gitOrganizations?: GitOrganization[];

  @Field(() => [User])
  users?: User[];
}
