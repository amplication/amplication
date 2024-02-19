import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class RedesignProjectInput {
  @Field(() => String, {
    nullable: false,
  })
  projectId!: string;

  @Field(() => [RedesignProjectNewService], {
    nullable: false,
  })
  newServices!: RedesignProjectNewService[];

  @Field(() => [RedesignProjectMovedEntity], {
    nullable: false,
  })
  movedEntities!: RedesignProjectMovedEntity[];
}

@InputType({
  isAbstract: true,
})
export class RedesignProjectNewService {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
  })
  name!: string;
}
@InputType({
  isAbstract: true,
})
export class RedesignProjectMovedEntity {
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
