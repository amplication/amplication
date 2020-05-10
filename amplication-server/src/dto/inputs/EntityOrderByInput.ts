import { Field, InputType } from '@nestjs/graphql';
import { OrderByArg } from '../../enums/OrderByArg';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityOrderByInput {
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

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  name?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  displayName?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  pluralDisplayName?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  description?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  isPersistent?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  allowFeedback?: keyof typeof OrderByArg | null;

  @Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  primaryField?: keyof typeof OrderByArg | null;
}
