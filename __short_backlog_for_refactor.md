

### Backlog for install nx

#### refactor package json
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
  rm -rf packages/test
  ```

- working on `refactor-package-json`
  >
  > ```bash
  > yarn nx workspace-generator refactor-package-json
  > ```


  ```bash
  yarn add -D fs-extra @types/fs-extra
  ```

#### remove lerna


### nx workspace library generator
- by default will use @nrwl/node:lib or @nrwl/angular:lib to generate all package in packages directory.
  - why?
    - because I need use ng-packagr to build all packages. make sure it can build successfully.
    - avoid use webpack build. it bundle all together, but currently I just need to check package circle dependency.
  - why use ng-packagr?
    - because ng-packagr has circle dependency check.
  - why not use ng-packagr to check node build?
    - newest ng-packagr use mjs output. it can't run perfect in current nodejs environment

- generate test repo first

  ```bash
  tee -a workspace.json <<EOF
  {
    "version": 2,
    "projects": {
    }
  }
  EOF
  cat node_modules/nx/presets/npm.json > nx.json
  yarn nx g @nrwl/node:lib --buildable --publishable --importPath @amplication/test
  ```

- all bash backlog in refactor-nx-package
  ```bash
  yarn nx workspace-generator refactor-nx-package
  ```
  ```bash
  yarn nx workspace-generator refactor-nx-package amplication-cli
  yarn nx workspace-generator refactor-nx-package amplication-client
  yarn nx workspace-generator refactor-nx-package amplication-code-gen-types
  yarn nx workspace-generator refactor-nx-package amplication-data-service-generator
  yarn nx workspace-generator refactor-nx-package amplication-design-system
  yarn nx workspace-generator refactor-nx-package amplication-git-pull-request-service
  yarn nx workspace-generator refactor-nx-package amplication-git-service
  yarn nx workspace-generator refactor-nx-package amplication-kafka
  yarn nx workspace-generator refactor-nx-package amplication-nest-logger-module
  yarn nx workspace-generator refactor-nx-package amplication-prisma-db
  yarn nx workspace-generator refactor-nx-package amplication-scheduler
  yarn nx workspace-generator refactor-nx-package amplication-server
  yarn nx workspace-generator refactor-nx-package amplication-storage-gateway
  ```

- generate package
  ```bash
  yarn nx run amplication-cli:ng-packagr-build
  ```

  ```bash
  yarn nx run-many --target=ng-packagr-build --all
  ```



- react build problem
  - @types/react 17.0.43

  ```bash
  yarn nx run-many --target=ng-packagr-build --all
  ```



- react build problem
  - @types/react 17.0.43
  - ```js
	"resolutions": {
	  "**/@types/react": "17.0.34"
	}
	```

- amplication-server
  ```bash
  mkdir -p node_modules/@amplication
  find dist/packages -type d -depth 1|while read FILE;do  ln -sf ../../$FILE "node_modules/@amplication/$(basename $FILE |cut -b 13-)";done
  ```


- ready for pr
  ```bash
  ```









>
