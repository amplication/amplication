import { registerEnumType } from '@nestjs/graphql';

export enum EnumDeploymentStatus {
  Waiting = 'Waiting',
  Completed = 'Completed',
  Failed = 'Failed',
  Removed = 'Removed'
}

registerEnumType(EnumDeploymentStatus, {
  name: 'EnumDeploymentStatus'
});
