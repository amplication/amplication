import { registerEnumType } from '@nestjs/graphql';

export enum EnumBuildStatus {
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
  Invalid = 'Invalid'
}

registerEnumType(EnumBuildStatus, {
  name: 'EnumBuildStatus'
});
