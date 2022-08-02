import { registerEnumType } from '@nestjs/graphql';

export enum EnumBuildStatus {
  Init = 'Init',
  InProgress = 'InProgress',
  Succeeded = 'Succeeded',
  Failed = 'Failed',
  Stopped = 'Stopped'
}

registerEnumType(EnumBuildStatus, {
  name: 'EnumBuildStatus'
});
