import { Field, InputType, Int } from '@nestjs/graphql';
import { ResourceCreateInput } from './ResourceCreateInput';
import { EnumDataType } from 'src/enums/EnumDataType';

@InputType({
  isAbstract: true
})
export class AppCreateWithEntitiesFieldInput {
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
export class AppCreateWithEntitiesEntityInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;

  @Field(() => [AppCreateWithEntitiesFieldInput], {
    nullable: false
  })
  fields!: AppCreateWithEntitiesFieldInput[];

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

  @Field(() => [AppCreateWithEntitiesEntityInput], {
    nullable: false
  })
  entities!: AppCreateWithEntitiesEntityInput[];

  @Field(() => String, {
    nullable: false
  })
  commitMessage!: string;
}
