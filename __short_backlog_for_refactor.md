

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
