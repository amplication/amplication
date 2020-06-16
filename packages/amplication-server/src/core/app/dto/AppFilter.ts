import { Field, InputType } from '@nestjs/graphql';
import { AppWhereInput } from './AppWhereInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class AppFilter {
  @Field(() => AppWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: AppWhereInput | null;

  @Field(() => AppWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: AppWhereInput | null;

  @Field(() => AppWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: AppWhereInput | null;
}
