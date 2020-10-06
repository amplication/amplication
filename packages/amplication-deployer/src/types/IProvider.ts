import { Configuration } from "./Configuration";
import { Variables } from "./Variables";
import { DeployResult } from "./DeployResult";

/**
 * Provides an interface for deployment
 */
export interface IProvider {
  /**
   * Deploys according to given Terraform configuration
   * @param configuration Terraform configuration
   * @param variables Terraform variables required by given configuration
   */
  deploy(
    configuration: Configuration,
    variables: Variables
  ): Promise<DeployResult>;
}
