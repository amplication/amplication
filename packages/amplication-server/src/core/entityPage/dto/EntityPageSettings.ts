import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
@InputType('EntityPageSettingsInput', {
  isAbstract: true,
  description: undefined
})
export class EntityPageSettings {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  url!: string;
}
