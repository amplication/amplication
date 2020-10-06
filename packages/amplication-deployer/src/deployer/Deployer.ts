import { DeployResult, IProvider, Configuration, Variables } from "../types";
import { InvalidDefaultError } from "./InvalidDefaultError";

export type DeployerOptions = {
  default: string;
  providers: Record<string, IProvider | Promise<IProvider>>;
};

export class Deployer {
  constructor(readonly options: DeployerOptions) {
    if (!(options.default in options.providers)) {
      throw new InvalidDefaultError(options.default);
    }
  }
  async deploy(
    configuration: Configuration,
    variables: Variables,
    providerName?: string
  ): Promise<DeployResult> {
    providerName = providerName || this.options.default;
    const provider = await this.options.providers[providerName];
    return provider.deploy(configuration, variables);
  }
}
