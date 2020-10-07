import { registerEnumType } from '@nestjs/graphql';

export enum EnumDeploymentStatus {
  Completed = 'Completed',
  Waiting = 'Waiting',
  Active = 'Active',
  Delayed = 'Delayed',
  Failed = 'Failed',
  Paused = 'Paused'
}

registerEnumType(EnumDeploymentStatus, {
  name: 'EnumDeploymentStatus'
});
