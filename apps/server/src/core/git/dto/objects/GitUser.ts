import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true
})
export class GitUser {
  @Field(() => String, { nullable: false })
  username!: string;
}
