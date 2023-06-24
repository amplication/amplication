import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CreateEntitiesFromPrismaSchemaInput {
  @Field(() => String, {
    nullable: false,
  })
  resourceId!: string;
}
