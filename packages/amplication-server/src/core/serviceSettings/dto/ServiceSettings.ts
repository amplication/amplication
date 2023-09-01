import { Field, ObjectType } from "@nestjs/graphql";
import type { JsonValue } from "type-fest";
import { IBlock } from "../../../models";
import { AdminUISettings } from "./AdminUISettings";
import { EnumAuthProviderType } from "./EnumAuthenticationProviderType";
import { ServerSettings } from "./ServerSettings";
import { CodeGeneratorVersionStrategy } from "@amplication/schema-registry";
import { registerEnumType } from "@nestjs/graphql";

@ObjectType({
  implements: IBlock,
  isAbstract: true,
})
export class ServiceSettings extends IBlock {
  @Field(() => EnumAuthProviderType, {
    nullable: false,
  })
  authProvider!: EnumAuthProviderType;

  @Field(() => AdminUISettings, {
    nullable: false,
  })
  adminUISettings: AdminUISettings & JsonValue;

  @Field(() => ServerSettings, {
    nullable: false,
  })
  serverSettings: ServerSettings & JsonValue;

  @Field(() => String, {
    nullable: true,
  })
  authEntityName?: string & JsonValue;

  @Field(() => CodeGeneratorVersionOptions, {
    nullable: false,
  })
  codeGeneratorVersionOptions!: CodeGeneratorVersionOptions & JsonValue;
}

@ObjectType({
  isAbstract: true,
})
export class CodeGeneratorVersionOptions {
  @Field(() => String, {
    nullable: true,
  })
  version?: string;

  @Field(() => CodeGeneratorVersionStrategy, {
    nullable: true,
  })
  selectionStrategy?: CodeGeneratorVersionStrategy;
}

registerEnumType(CodeGeneratorVersionStrategy, {
  name: "CodeGeneratorVersionStrategy",
});
