import { Field, ObjectType } from '@nestjs/graphql';
import { EnumSourceControlService } from 'src/core/git/dto/enums/EnumSourceControlService';

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

  @Field(() => EnumSourceControlService, {
    nullable: false
  })
  provider!: keyof typeof EnumSourceControlService;

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

  // @Field(() => [GitRepository], {
  //   nullable: false,
  //   description: undefined
  // })
  // gitRepository: GitRepository[];

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

  // @Field(() => Workspace, {
  //   nullable: false,
  //   description: undefined
  // })
  // workspace!: Workspace;
}
