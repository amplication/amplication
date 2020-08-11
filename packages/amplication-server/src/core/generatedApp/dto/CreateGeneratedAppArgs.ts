import { ArgsType } from '@nestjs/graphql';
import { GeneratedAppCreateInput } from './GeneratedAppCreateInput';

@ArgsType()
export class CreateGeneratedAppArgs {
  data: GeneratedAppCreateInput;
}
