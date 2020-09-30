import { BuildResult } from "./BuildResult";

export interface IProvider {
  build(repository: string, tag: string, codeURL: string): Promise<BuildResult>;
}
