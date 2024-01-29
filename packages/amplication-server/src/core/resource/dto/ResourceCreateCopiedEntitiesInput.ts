import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class ResourcesCreateCopiedEntitiesInput {
  @Field(() => String, {
    nullable: false,
  })
  projectId!: string;

  @Field(() => [ModelGroupResource], {
    nullable: false,
  })
  modelGroupsResources!: ModelGroupResource[];

  @Field(() => [CopiedEntity], {
    nullable: false,
  })
  entitiesToCopy!: CopiedEntity[];
}

@InputType({
  isAbstract: true,
})
export class ModelGroupResource {
  @Field(() => String, {
    nullable: false,
  })
  tempId!: string;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;
}
@InputType({
  isAbstract: true,
})
export class CopiedEntity {
  @Field(() => String, {
    nullable: false,
  })
  targetResourceId!: string;

  @Field(() => String, {
    nullable: false,
  })
  originalResourceId!: string;

  @Field(() => String, {
    nullable: false,
  })
  entityId!: string;
}
