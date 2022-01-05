import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class RepoCreateInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;
  @Field(() => Boolean, {
    nullable: false
  })
  public!: boolean;
}
