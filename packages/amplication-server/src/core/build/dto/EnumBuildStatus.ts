import { registerEnumType } from '@nestjs/graphql';

export enum EnumBuildStatus {
  Completed = 'Completed',
  Waiting = 'Waiting',
  Active = 'Active',
  Delayed = 'Delayed',
  Failed = 'Failed',
  Paused = 'Paused'
}

registerEnumType(EnumBuildStatus, {
  name: 'EnumBuildStatus'
});
