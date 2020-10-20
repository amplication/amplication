import { BackendConfiguration } from "./BackendConfiguration";
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
   * @param backendConfiguration Terraform backend configuration
   */
  deploy(
    configuration: Configuration,
    variables?: Variables,
    backendConfiguration?: BackendConfiguration
  ): Promise<DeployResult>;
}
