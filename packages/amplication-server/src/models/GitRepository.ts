import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GitRepository {

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  gitOrganizationId!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date; 

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt?: Date; 
} 