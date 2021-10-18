import { registerEnumType } from '@nestjs/graphql';

export enum EnumSourceControlService {
  Github = 'Github'
}

registerEnumType(EnumSourceControlService, {
  name: 'EnumSourceControlService'
});
