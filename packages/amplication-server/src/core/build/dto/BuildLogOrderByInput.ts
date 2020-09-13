import { InputType, Field } from '@nestjs/graphql';
import { SortOrder } from 'src/enums/SortOrder';

@InputType({
  isAbstract: true
})
export class BuildLogOrderByInput {
  @Field(() => SortOrder, {
    nullable: true
  })
  id?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true
  })
  createdAt?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true
  })
  message?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true
  })
  meta?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true
  })
  level?: SortOrder | null;
}
