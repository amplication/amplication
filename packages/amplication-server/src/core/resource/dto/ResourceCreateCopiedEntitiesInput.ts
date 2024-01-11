import { CopiedEntities } from "./CopiedEntities";
import { Field, InputType } from "@nestjs/graphql";

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
