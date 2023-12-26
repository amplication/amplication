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

@InputType({
  isAbstract: true,
})
export class ResourcesCreateCopiedEntitiesInput {
  @Field(() => [CopiedEntityWithTargetResource], {
    nullable: false,
  })
  entitiesToCopy!: CopiedEntityWithTargetResource[];
}

@InputType({
  isAbstract: true,
})
export class CopiedEntityWithTargetResource {
  @Field(() => String, {
    nullable: false,
  })
  targetResourceId!: string;

  @Field(() => String, {
    nullable: false,
  })
  entityId!: string;
}
