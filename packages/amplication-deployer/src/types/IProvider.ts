import { DeployResult } from "./DeployResult";

/**
 * Provides an interface for deployment
 */
export interface IProvider {
  /**
   * Deploys according to given Terraform configuration
   * @param configuration Terraform configuration
   */
  deploy(
    /** @todo use type */
    configuration: Object
  ): Promise<DeployResult>;
}
