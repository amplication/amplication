import { InputType } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto';

@InputType()
export class GeneratedAppCreateInput {
  app: WhereUniqueInput;
}
