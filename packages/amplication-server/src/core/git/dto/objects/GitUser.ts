import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GitUser {
  @Field(() => String, { nullable: false })
  username!: string;
}
