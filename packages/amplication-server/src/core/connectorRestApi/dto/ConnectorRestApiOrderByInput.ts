import { Field, InputType } from '@nestjs/graphql';
import { OrderByArg } from 'src/enums/OrderByArg';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ConnectorRestApiOrderByInput {
  @Field(() => OrderByArg, {
    nullable: true,
    description: undefined
  })
  id?: keyof typeof OrderByArg | null;

  @Field(() => OrderByArg, {
    nullable: true,
    description: undefined
  })
  createdAt?: keyof typeof OrderByArg | null;

  @Field(() => OrderByArg, {
    nullable: true,
    description: undefined
  })
  updatedAt?: keyof typeof OrderByArg | null;

  @Field(() => OrderByArg, {
    nullable: true,
    description: undefined
  })
  name?: keyof typeof OrderByArg | null;

  @Field(() => OrderByArg, {
    nullable: true,
    description: undefined
  })
  description?: keyof typeof OrderByArg | null;
}
