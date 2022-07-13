import { ObjectType, Field } from '@nestjs/graphql';
import { Resource } from 'src/models'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true
})
export class Environment {
  @Field(() => String, {
    nullable: false
  })
  id!: string;

  @Field(() => Date, {
    nullable: false
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @Field(() => Resource)
  resource?: Resource;

  @Field(() => String)
  resourceId!: string;

  @Field(() => String, {
    nullable: false
  })
  name: string;

  @Field(() => String, {
    nullable: true
  })
  description?: string;

  @Field(() => String)
  address: string;
}
