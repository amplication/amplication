import { Field, InputType } from '@nestjs/graphql';
import { AppWhereInput } from './';

@InputType({
  isAbstract: true,
  description: undefined
})
export class AppFilter {
  @Field(_type => AppWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: AppWhereInput | null;

  @Field(_type => AppWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: AppWhereInput | null;

  @Field(_type => AppWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: AppWhereInput | null;
}
