import { SortOrder } from 'src/enums/SortOrder';
import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ProjectOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  id?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  deletedAt?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  name?: SortOrder | null;
}
