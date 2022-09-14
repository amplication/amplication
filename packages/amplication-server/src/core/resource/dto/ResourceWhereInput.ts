import { Field, InputType } from '@nestjs/graphql';
import { DateTimeFilter, ProjectWhereInput, StringFilter } from '../../../dto';
import { EnumResourceTypeFilter } from './EnumResourceTypeFilter';

@InputType({
  isAbstract: true
})
export class ResourceWhereInput {
  @Field(() => String, {
    nullable: true
  })
  id?: string | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  name?: StringFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  description?: StringFilter | null;

  @Field(() => ProjectWhereInput, { nullable: true })
  project?: ProjectWhereInput | null;

  @Field(() => String, { nullable: true })
  projectId?: string | null;

  @Field(() => EnumResourceTypeFilter, {
    nullable: true
  })
  resourceType?: EnumResourceTypeFilter | null;
}
