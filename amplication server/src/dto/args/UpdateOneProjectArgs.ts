import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { ProjectUpdateInput } from "../inputs";
import { WhereUniqueInput } from "../inputs";

@ArgsType()
export class UpdateOneProjectArgs {
  @Field(_type => ProjectUpdateInput, { nullable: false })
  data!: ProjectUpdateInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
