import { registerEnumType } from '@nestjs/graphql';

export enum EnumActionStepStatus {
  Waiting = 'Waiting',
  Running = 'Running',
  Failed = 'Failed',
  Success = 'Success'
}

registerEnumType(EnumActionStepStatus, {
  name: 'EnumActionStepStatus'
});
