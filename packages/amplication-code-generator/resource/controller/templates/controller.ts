import { Controller } from "@nestjs/common";

interface SERVICE {}

// @ts-ignore
@Controller(RESOURCE)
export class CONTROLLER {
  constructor(private readonly service: SERVICE) {}
}
