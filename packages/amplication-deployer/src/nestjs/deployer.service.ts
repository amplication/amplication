/**
 * Nest.js service
 */

import { Inject, Injectable } from "@nestjs/common";
import { Deployer, DeployerOptions } from "../deployer/Deployer";
import { DEPLOYER_OPTIONS } from "./deployerOptions.token";

@Injectable()
export class DeployerService extends Deployer {
  constructor(@Inject(DEPLOYER_OPTIONS) options: DeployerOptions) {
    super(options);
  }
}
