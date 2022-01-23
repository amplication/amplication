import { ObjectType } from '@nestjs/graphql';
import { GitRepo } from '../../git/dto/objects/GitRepo';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GithubRepo extends GitRepo {}
