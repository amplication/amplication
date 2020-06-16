import { ArgsType, Field, Int } from '@nestjs/graphql';
import { OrganizationOrderByInput } from './OrganizationOrderByInput';
import { OrganizationWhereInput } from './OrganizationWhereInput';

@ArgsType()
export class FindManyOrganizationArgs {
  @Field(() => OrganizationWhereInput, { nullable: true })
  where?: OrganizationWhereInput | null;

  @Field(() => OrganizationOrderByInput, { nullable: true })
  orderBy?: OrganizationOrderByInput | null;

  @Field(() => Int, { nullable: true })
  skip?: number | null;

  @Field(() => Int, { nullable: true })
  take?: number | null;
}
