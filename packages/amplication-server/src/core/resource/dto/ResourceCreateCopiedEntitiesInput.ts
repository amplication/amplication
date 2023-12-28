import { Field, InputType } from "@nestjs/graphql";
import { CopiedEntities } from "./CopiedEntities";

@InputType({
  isAbstract: true,
})
export class ResourceCreateCopiedEntitiesInput {
  @Field(() => String, {
    nullable: false,
  })
  targetResourceId!: string;

  @Field(() => [CopiedEntities], {
    nullable: false,
  })
  entitiesToCopy!: CopiedEntities[];
}
