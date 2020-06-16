import { ArgsType, Field } from '@nestjs/graphql';
import { OrganizationCreateInput } from './OrganizationCreateInput';

@ArgsType()
export class CreateOneOrganizationArgs {
  @Field(() => OrganizationCreateInput, { nullable: false })
  data!: OrganizationCreateInput;
}
