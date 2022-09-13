import { Field, InputType } from '@nestjs/graphql';
import { ProjectWhereInput } from 'src/core/project/dto/ProjectWhereInput';
import { DateTimeFilter, StringFilter } from 'src/dto';
import { EnumResourceTypeFilter } from './EnumResourceTypeFilter';

@InputType({
  isAbstract: true
})
export class ResourceWhereInput {
  @Field(() => StringFilter, {
    nullable: true
  })
  id?: StringFilter | null;

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
