import { ObjectType } from '@nestjs/graphql';
import { RemoteGitRepository } from '../../git/dto/objects/RemoteGitRepository';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GithubRepo extends RemoteGitRepository {}
