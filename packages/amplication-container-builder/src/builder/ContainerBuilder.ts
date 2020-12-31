import { BuildRequest, BuildResult, IProvider } from "../types";
import { InvalidDefaultError } from "./InvalidDefaultError";

export type ContainerBuilderOptions = {
  default: string;
  providers: Record<string, IProvider | Promise<IProvider>>;
};

export class ContainerBuilder {
  constructor(readonly options: ContainerBuilderOptions) {
    if (!(options.default in options.providers)) {
      throw new InvalidDefaultError(options.default);
    }
  }
  async build(
    request: BuildRequest,
    providerName?: string
  ): Promise<BuildResult> {
    providerName = providerName || this.options.default;
    const provider = await this.options.providers[providerName];
    return provider.build(request);
  }

  async getStatus(
    statusQuery: any,
    providerName?: string
  ): Promise<BuildResult> {
    providerName = providerName || this.options.default;
    const provider = await this.options.providers[providerName];
    return provider.getStatus(statusQuery);
  }

  async createImageId(tag: string, providerName?: string): Promise<string> {
    providerName = providerName || this.options.default;
    const provider = await this.options.providers[providerName];
    return provider.createImageId(tag);
  }
}
