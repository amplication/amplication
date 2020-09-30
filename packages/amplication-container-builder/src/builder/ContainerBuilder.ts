import { BuildResult, IProvider } from "../types";
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
    repository: string,
    tag: string,
    codeURL: string,
    provider?: string
  ): Promise<BuildResult> {
    provider = provider || this.options.default;
    const builder = await this.options.providers[provider];
    return builder.build(repository, tag, codeURL);
  }
}
