import { Field, InputType } from '@nestjs/graphql';
import { JsonObject, JsonValue } from 'type-fest';

@InputType({
  isAbstract: true,
  description: undefined
})
export class LookupPropertiesInput implements JsonObject {
  [key: string]: JsonValue;

  @Field(() => String, { nullable: false })
  relatedEntityId!: string;

  @Field(() => String, { nullable: false })
  allowMultipleSelection: boolean;
}
