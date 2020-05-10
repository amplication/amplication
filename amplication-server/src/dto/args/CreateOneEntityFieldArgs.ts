import { ArgsType, Field} from "@nestjs/graphql";
import { EntityFieldCreateInput,WhereParentIdInput } from "../inputs";

@ArgsType()
export class CreateOneEntityFieldArgs {
  @Field(_type => EntityFieldCreateInput, { nullable: false })
  data!: EntityFieldCreateInput;
  // @Field(_type => WhereParentIdInput, { nullable: false })
  // where :WhereParentIdInput;
}
