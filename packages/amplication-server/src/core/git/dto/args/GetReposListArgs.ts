import { ArgsType } from '@nestjs/graphql';
import { BaseGitArgs } from './BaseGitArgs';

@ArgsType()
export class GetReposListArgs extends BaseGitArgs {}
