import { Field, InputType, Int } from '@nestjs/graphql';
import { ResourceCreateInput } from './ResourceCreateInput';
import { EnumDataType } from 'src/enums/EnumDataType';

@InputType({
  isAbstract: true
})
export class ResourceCreateWithEntitiesFieldInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => EnumDataType, {
    nullable: true,
    description: undefined
  })
  dataType?: keyof typeof EnumDataType | null;
}

@InputType({
  isAbstract: true
})
export class ResourceCreateWithEntitiesEntityInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => [ResourceCreateWithEntitiesFieldInput], {
    nullable: false
  })
  fields!: ResourceCreateWithEntitiesFieldInput[];

  @Field(() => [Int], {
    nullable: true
  })
  relationsToEntityIndex?: number[] | null;
}

@InputType({
  isAbstract: true
})
export class ResourceCreateWithEntitiesInput {
  @Field(() => ResourceCreateInput, {
    nullable: false
  })
  resource!: ResourceCreateInput;

  @Field(() => [ResourceCreateWithEntitiesEntityInput], {
    nullable: false
  })
  entities!: ResourceCreateWithEntitiesEntityInput[];

  @Field(() => String, {
    nullable: false
  })
  commitMessage!: string;
}
