import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class ServerSettings {
  @Field(() => Boolean, {
    nullable: false
  })
  generateGraphQL!: boolean;

  @Field(() => Boolean, {
    nullable: false
  })
  generateRestApi!: boolean;

  @Field(() => String, {
    nullable: false
  })
  serverPath!: string;
}
