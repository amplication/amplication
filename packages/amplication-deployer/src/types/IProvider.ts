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

  /**
   * Deploys according to given Terraform configuration
   * @param configuration Terraform configuration
   * @param variables Terraform variables required by given configuration
   * @param backendConfiguration Terraform backend configuration
   */
  destroy(
    configuration: Configuration,
    variables?: Variables,
    backendConfiguration?: BackendConfiguration
  ): Promise<DeployResult>;

  /**
   * Gets the status of the deploy process for the statusQuery returned from the provider in the deploy() action
   * @param statusQuery Provider specific query to be used to find the requested deploy process
   */
  getStatus(statusQuery: any): Promise<DeployResult>;
}
