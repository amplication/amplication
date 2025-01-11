import * as graphql from "@nestjs/graphql";

declare interface SERVICE {}

export class RESOLVER {
  constructor(protected readonly service: SERVICE) {}
}
