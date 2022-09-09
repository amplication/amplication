

### Backlog for install nx
- add nx and update nx.
- add nx generator to run scripts.
- remove all node_modules in packages.
  ```bash
	find ./packages -type d -name "node_modules" |while read DIR; do rm -rf $DIR;done
  ```
- collect all package.json dependencies and devDependencies into root package.json.
  ```bash
  yarn nx workspace-generator refactor-package-json
  ```
- nx can't run properly, so we need to add `@nrwl/workspace` to root package.json,
  and try to dry run generate a project successfully
  ```bash
  yarn add -D @nrwl/node
  yarn add -D typescript
  yarn nx g @nrwl/node:app test
  yarn nx g @nrwl/node:remove test
  ```
