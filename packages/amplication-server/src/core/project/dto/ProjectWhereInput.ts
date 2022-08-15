import { Field, InputType } from '@nestjs/graphql';
import { WorkspaceWhereInput } from 'src/core/workspace/dto';
import { DateTimeFilter, StringFilter } from 'src/dto';
import { ResourceListRelationFilter } from '../../resource/dto/ResourceListRelationFilter';

@InputType({
  isAbstract: true
})
export class ProjectWhereInput {
  @Field(() => String, {
    nullable: true
  })
  id?: string | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  deletedAt?: DateTimeFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  name?: StringFilter | null;

  workspace?: WorkspaceWhereInput | null;

  @Field(() => ResourceListRelationFilter, { nullable: true })
  resources?: ResourceListRelationFilter;
}
