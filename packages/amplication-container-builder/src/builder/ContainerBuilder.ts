import { BuildResult, IProvider } from "../types";
import { InvalidDefaultError } from "./InvalidDefaultError";

export type ContainerBuilderOptions = {
  default: string;
  providers: Record<string, IProvider | Promise<IProvider>>;
};

export class ContainerBuilder implements IProvider {
  constructor(readonly options: ContainerBuilderOptions) {
    if (!(options.default in options.providers)) {
      throw new InvalidDefaultError(options.default);
    }
  }
  async build(
    repository: string,
    tag: string,
    codeURL: string
  ): Promise<BuildResult> {
    const builder = await this.options.providers[name || this.options.default];
    return builder.build(repository, tag, codeURL);
  }
}
