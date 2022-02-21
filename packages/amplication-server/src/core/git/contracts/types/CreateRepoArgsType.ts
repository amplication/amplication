import { CreateRepoArgs } from '../../dto/args/CreateRepoArgs';

export type CreateRepoArgsType = Omit<
  CreateRepoArgs,
  'appId' | 'sourceControlService'
> & {
  gitOrganizationId: string;
};
