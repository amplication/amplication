import { InputType } from '@nestjs/graphql';
import { ProjectWhereInput } from './ProjectWhereInput';

@InputType({
  isAbstract: true
})
export class ProjectFindFirstArgs {
  where?: ProjectWhereInput;
}
