import { EnumGitProvider } from "../types";

export const GitProvidersUrlMap: Readonly<
  Record<keyof typeof EnumGitProvider, string>
> = Object.freeze({
  [EnumGitProvider.Github]: "github.com",
});
