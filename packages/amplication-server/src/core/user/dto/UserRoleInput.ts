import { Field, InputType } from '@nestjs/graphql';
import { Role } from 'src/enums/Role';

@InputType({
  isAbstract: true
})
export class UserRoleInput {
  @Field(() => Role, {
    nullable: false
  })
  role: Role;
}
