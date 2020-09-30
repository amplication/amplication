/**
 * Nest.js service
 */

import { Inject, Injectable } from "@nestjs/common";
import { Builder, BuilderOptions } from "../builder/Builder";
import { BUILDER_OPTIONS } from "./builderOptions.token";

@Injectable()
export class BuilderService extends Builder {
  constructor(@Inject(BUILDER_OPTIONS) options: BuilderOptions) {
    super(options);
  }
}
