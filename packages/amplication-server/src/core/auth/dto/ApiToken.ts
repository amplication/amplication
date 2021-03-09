import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true
})
export class ApiToken {
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

  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => String, {
    nullable: false
  })
  userId!: string;

  @Field(() => String, {
    nullable: true
  })
  token?: string;

  @Field(() => String, {
    nullable: false
  })
  previewChars!: string;

  @Field(() => Date, {
    nullable: false
  })
  lastAccessAt!: Date;
}
