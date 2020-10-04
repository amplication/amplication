/**
 * Nest.js service
 */

import { Inject, Injectable } from "@nestjs/common";
import {
  ContainerBuilder,
  ContainerBuilderOptions,
} from "../builder/ContainerBuilder";
import { CONTAINER_BUILDER_OPTIONS } from "./containerBuilderOptions.token";

@Injectable()
export class ContainerBuilderService extends ContainerBuilder {
  constructor(@Inject(CONTAINER_BUILDER_OPTIONS) options: ContainerBuilderOptions) {
    super(options);
  }
}
