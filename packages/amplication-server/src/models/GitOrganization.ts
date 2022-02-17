import { Field, ObjectType } from '@nestjs/graphql';
import { EnumProvider } from 'src/enums/EnumProvider';
import { Workspace } from '.';
import { GitRepository } from './GitRepository';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GitOrganization {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => EnumProvider, {
    nullable: false,
    description: undefined
  })
  provider!: EnumProvider;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(() => Number, {
    nullable: false,
    description: undefined
  })
  installationId!: number;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  code!: string;

  @Field(() => [GitRepository], {
    nullable: false,
    description: undefined
  })
  gitRepository: GitRepository[];

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
  
  @Field(() => Workspace, {
    nullable: false,
    description: undefined
  })
  workspace!: Workspace;

} 