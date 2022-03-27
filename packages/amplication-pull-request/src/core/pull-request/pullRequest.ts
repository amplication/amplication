import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PullRequest {
  constructor() {
    this.create();
  }
  private create(): PullRequest {
    throw new Error('Method not implemented.');
  }
  @Field(() => String)
  url!: string;
}
