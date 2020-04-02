import { Field,  InputType} from "type-graphql";
 import { WhereParentIdInput } from './';

@InputType({
  isAbstract: true,
  description: undefined,
})
export class ProjectCreateInput {

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;


  //do not expose to graphQL - use the user's current organization
  organization!: WhereParentIdInput;


}
