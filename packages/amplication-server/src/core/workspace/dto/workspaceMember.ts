import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/models'; // eslint-disable-line import/no-cycle
import { Invitation } from './Invitation'; // eslint-disable-line import/no-cycle
import { EnumWorkspaceMemberType } from './EnumWorkspaceMemberType';
import { WorkspaceMemberType } from './WorkspaceMemberType'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true
})
export class WorkspaceMember {
  @Field(() => EnumWorkspaceMemberType, {
    nullable: false
  })
  type!: EnumWorkspaceMemberType;

  @Field(() => WorkspaceMemberType, {
    nullable: false
  })
  member!: User | Invitation;
}
