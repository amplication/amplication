import {
  DeployResult,
  IProvider,
  Configuration,
  Variables,
  BackendConfiguration,
} from "../types";
import { InvalidDefaultError } from "./InvalidDefaultError";
import { NoProviderDefinedError } from "./NoProviderDefinedError";

export type DeployerOptions = {
  default?: string;
  providers: Record<string, IProvider | Promise<IProvider>>;
};

export class Deployer {
  constructor(readonly options: DeployerOptions) {
    if (options.default && !(options.default in options.providers)) {
      throw new InvalidDefaultError(options.default);
    }
  }
  async deploy(
    configuration: Configuration,
    variables?: Variables,
    backendConfiguration?: BackendConfiguration,
    providerName?: string
  ): Promise<DeployResult> {
    providerName = providerName || this.options.default;
    if (!providerName) {
      throw new NoProviderDefinedError();
    }
    const provider = await this.options.providers[providerName];
    return provider.deploy(configuration, variables, backendConfiguration);
  }

  async destroy(
    configuration: Configuration,
    variables?: Variables,
    backendConfiguration?: BackendConfiguration,
    providerName?: string
  ): Promise<DeployResult> {
    providerName = providerName || this.options.default;
    if (!providerName) {
      throw new NoProviderDefinedError();
    }
    const provider = await this.options.providers[providerName];
    return provider.destroy(configuration, variables, backendConfiguration);
  }

  async getStatus(
    statusQuery: any,
    providerName?: string
  ): Promise<DeployResult> {
    providerName = providerName || this.options.default;
    if (!providerName) {
      throw new NoProviderDefinedError();
    }
    const provider = await this.options.providers[providerName];
    return provider.getStatus(statusQuery);
  }
}
