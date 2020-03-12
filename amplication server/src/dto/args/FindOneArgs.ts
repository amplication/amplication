
import { ArgsType, Field} from "type-graphql";
import { WhereUniqueInput } from '../inputs';

@ArgsType()
export class FindOneArgs {
  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
