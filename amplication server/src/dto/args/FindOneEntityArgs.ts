
import { ArgsType, Field} from "type-graphql";
import { FindOneArgs } from './';

@ArgsType()
export class FindOneEntityArgs extends FindOneArgs {
  @Field(_type => Number, { nullable: true })
  version: number;
}
