import { Field, InputType } from '@nestjs/graphql';
import { OrderByArg } from '../../enums/OrderByArg';

@InputType({
  isAbstract: true,
  description: undefined
})
export class UserOrderByInput {
  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  id?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  createdAt?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  updatedAt?: keyof typeof OrderByArg | null;
}
