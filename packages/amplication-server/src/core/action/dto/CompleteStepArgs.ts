import { EnumActionStepStatus } from './EnumActionStepStatus';
import { WhereUniqueInput } from 'src/dto';

export class CompleteStepArgs {
  status: EnumActionStepStatus;
  where!: WhereUniqueInput;
}
