import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class GeneratedApp {
  @Field()
  id: string;
}
