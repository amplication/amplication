import { Field, ObjectType } from "@nestjs/graphql";
import { EnumUserActionStatus } from "../../userAction/types";

@ObjectType({
  isAbstract: true,
})
class BreakServiceToMicroservicesItemEntities {
  @Field()
  originalEntityId: string;

  @Field()
  name: string;
}

@ObjectType({
  isAbstract: true,
})
class BreakServiceToMicroservicesItem {
  @Field()
  name: string;

  @Field()
  functionality: string;

  @Field(() => [BreakServiceToMicroservicesItemEntities])
  dataModels: BreakServiceToMicroservicesItemEntities[];
}

@ObjectType({
  isAbstract: true,
})
export class BreakServiceToMicroservicesData {
  @Field(() => [BreakServiceToMicroservicesItem])
  microservices: BreakServiceToMicroservicesItem[];
}

@ObjectType({
  isAbstract: true,
})
export class BreakServiceToMicroservicesResult {
  @Field(() => EnumUserActionStatus, {
    nullable: false,
    description: "The status of the user action",
  })
  status: EnumUserActionStatus;

  @Field(() => String, {
    nullable: false,
    description: "The original resource ID",
  })
  originalResourceId: string;

  @Field(() => BreakServiceToMicroservicesData, {
    nullable: true,
    description: "Prompt result with some data structure manipulation",
  })
  data: BreakServiceToMicroservicesData;
}
