# @amplication/util/git

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test util-git` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `nx lint util-git` to execute the lint via [ESLint](https://eslint.org/).

### How to

Just instantiate a new GitClientService and call the `create` method.

```typescript
import {
  GitClientService,
} from "@amplication/util/git";

const gitProviderArgs = {
    provider: EnumGitProvider.GitHub;
    installationId: "1234567890";
}

const gitClientService = await new GitClientService().create(gitProviderArgs);

gitClientService.getRepositories({ limit: 10, page: 1 });
```
