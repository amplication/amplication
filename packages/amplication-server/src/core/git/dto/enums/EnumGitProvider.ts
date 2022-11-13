import { registerEnumType } from '@nestjs/graphql';

export enum EnumGitProvider {
  Github = 'Github'
}

registerEnumType(EnumGitProvider, {
  name: 'EnumGitProvider'
});
