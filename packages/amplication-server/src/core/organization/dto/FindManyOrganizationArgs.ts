import { ArgsType, Field, Int } from '@nestjs/graphql';
import { OrganizationOrderByInput } from './';
import { OrganizationWhereInput } from './';

@ArgsType()
export class FindManyOrganizationArgs {
  @Field(_type => OrganizationWhereInput, { nullable: true })
  where?: OrganizationWhereInput | null;

  @Field(_type => OrganizationOrderByInput, { nullable: true })
  orderBy?: OrganizationOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => Int, { nullable: true })
  take?: number | null;
}
