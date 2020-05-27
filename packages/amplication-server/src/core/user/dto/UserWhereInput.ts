import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter, StringFilter } from '../../../dto/inputs';
import { OrganizationWhereInput } from '../../organization/dto';

@InputType({
  isAbstract: true,
  description: undefined
})
export class UserWhereInput {
  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  id?: StringFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFilter | null;

  @Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: UserWhereInput[] | null;

  @Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: UserWhereInput[] | null;

  @Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: UserWhereInput[] | null;

  @Field(_type => OrganizationWhereInput, {
    nullable: true,
    description: undefined
  })
  organization?: OrganizationWhereInput | null;
}
