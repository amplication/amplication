import { InputType, Field } from '@nestjs/graphql';
import { EnumBuildLogLevelFilter } from './EnumBuildLogLevelFilter';
import { WhereUniqueInput, DateTimeFilter, StringFilter } from 'src/dto';

@InputType({
  isAbstract: true
})
export class BuildLogWhereInput {
  @Field(() => StringFilter, {
    nullable: true
  })
  id?: StringFilter | null;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | null;

  @Field(() => StringFilter, {
    nullable: true
  })
  message?: StringFilter | null;

  @Field(() => EnumBuildLogLevelFilter, {
    nullable: true
  })
  level?: EnumBuildLogLevelFilter | null;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  build?: WhereUniqueInput | null;
}
