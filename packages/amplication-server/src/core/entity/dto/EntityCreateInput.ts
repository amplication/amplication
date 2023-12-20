import { Field, InputType } from "@nestjs/graphql";
import { WhereParentIdInput } from "../../../dto";

@InputType({
  isAbstract: true,
})
export class EntityCreateInput {
  @Field(() => String, {
    nullable: true,
    description:
      "allow creating the id for the entity when using import prisma schema because we need it for the relation",
  })
  id?: string;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  displayName!: string;

  @Field(() => String, {
    nullable: false,
  })
  pluralDisplayName!: string;

  @Field(() => String, {
    nullable: true,
  })
  customAttributes?: string;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => WhereParentIdInput, {
    nullable: false,
  })
  resource!: WhereParentIdInput;
}
