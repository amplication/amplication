import { ObjectType, Field } from '@nestjs/graphql';
import { App } from 'src/models'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Environment {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  @Field(() => App)
  app?: App;

  @Field(() => String)
  appId!: string;

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
