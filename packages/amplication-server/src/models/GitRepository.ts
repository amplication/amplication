import { Field, ObjectType } from '@nestjs/graphql';
import { App } from './App';
import { GitOrganization } from './GitOrganization';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GitRepository {

  @Field(() => Number, {
    nullable: false,
    description: undefined
  })
  id!: number;
  
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  uid!: string;

  @Field(() => Number, {
    nullable: false,
    description: undefined
  })
  organizationId!: number;

  @Field(() => GitOrganization, {
    nullable: false,
    description: undefined
  })
  gitOrganization!: GitOrganization;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  appId!: string;

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

  @Field(() => [App])
  apps?: App[];
} 
