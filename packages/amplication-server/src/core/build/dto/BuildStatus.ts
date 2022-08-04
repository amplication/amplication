import { registerEnumType } from '@nestjs/graphql';

export enum BuildStatus {
  Init = 'Init',
  InProgress = 'InProgress',
  Failed = 'Failed',
  Succeeded = 'Succeeded',
  Unpacking = 'Unpacking',
  Stopped = 'Stopped',
  Ready = 'Ready'
}

registerEnumType(BuildStatus, {
  name: 'BuildStatus'
});
