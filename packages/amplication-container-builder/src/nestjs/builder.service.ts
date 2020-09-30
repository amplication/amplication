/**
 * Nest.js service
 */

import { Inject, Injectable } from "@nestjs/common";
import { Builder, BuilderOptions } from "./Builder";

@Injectable()
export class BuilderService extends Builder {
  constructor(@Inject(BUILDER_OPTIONS) options: BuilderOptions) {
    super(options);
  }
}
