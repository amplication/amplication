import { Field, InputType } from '@nestjs/graphql';
import { Role } from 'src/enums/Role';

@InputType({
  isAbstract: true,
  description: undefined
})
export class UserRoleInput {
  @Field(() => Role, {
    nullable: false,
    description: undefined
  })
  role: Role;
}
