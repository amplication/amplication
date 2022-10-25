import { GitProvider } from "./git-provider.interface";
import { GitProviderEnum } from "../enums";

export interface GitHostProviderFactory {
  getHostProvider: (provider: GitProviderEnum) => GitProvider;
}
