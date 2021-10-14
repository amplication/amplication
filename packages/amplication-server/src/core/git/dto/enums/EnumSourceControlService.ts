import { registerEnumType } from '@nestjs/graphql';

export enum EnumSourceControlService {
  Github = 'Github',
  Gitlab = 'Gitlab'
}

registerEnumType(EnumSourceControlService, {
  name: 'EnumSourceControlService'
});
