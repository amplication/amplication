import { EnumActionStepStatus } from './EnumActionStepStatus';

export class CreateStepArgs {
  actionId: string;
  status: EnumActionStepStatus;
  message: string;
}
