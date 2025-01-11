import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class ServiceTemplateVersion {
  @Field(() => String, {
    nullable: false,
  })
  serviceTemplateId!: string;

  @Field(() => String, {
    nullable: false,
  })
  version!: string;
}
