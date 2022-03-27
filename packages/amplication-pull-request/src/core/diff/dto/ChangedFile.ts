import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class ChangedFile {
  @Field(() => String, { nullable: false })
  path!: string;
}
