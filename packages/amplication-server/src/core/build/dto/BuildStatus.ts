import { registerEnumType } from '@nestjs/graphql';

export enum BuildStatus {
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
  Invalid = 'Invalid'
}

registerEnumType(BuildStatus, {
  name: 'BuildStatus'
});
