import { registerEnumType } from "@nestjs/graphql";

export enum EnumMessagePatternConnectionOptions {
  "None" = "None",
  "Receive" = "Receive",
  "Send" = "Send",
}

registerEnumType(EnumMessagePatternConnectionOptions, {
  name: "EnumMessagePatternConnectionOptions",
});
