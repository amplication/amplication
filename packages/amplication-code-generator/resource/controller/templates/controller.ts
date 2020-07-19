import { Controller } from "@nestjs/common";

interface SERVICE {}

declare var RESOURCE: string;

@Controller(RESOURCE)
export class CONTROLLER {
  constructor(private readonly service: SERVICE) {}
}
