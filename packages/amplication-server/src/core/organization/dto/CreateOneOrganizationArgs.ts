import { ArgsType, Field } from '@nestjs/graphql';
import { OrganizationCreateInput } from './';

@ArgsType()
export class CreateOneOrganizationArgs {
  @Field(() => OrganizationCreateInput, { nullable: false })
  data!: OrganizationCreateInput;
}
