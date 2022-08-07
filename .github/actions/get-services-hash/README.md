# Create services hash action

###folders-to-hash: list of folders tp hash
```json
["ee/packages/amplication-git-pull-service"]
```
###hash-ignore: list of files and folders that dont need to be included in the hash
```json
["node_modules/**", "lib/**", "dist/**", "**/*.spec.ts","__tests__/**","__mocks__/**","test/**","tests/**"]
```

## Outputs

### service_hashes: A list of services hashes
```json
[{
  "pkg": "@amplication/git-pull-service",
  "folder": "ee/packages/amplication-git-pull-service",
  "hash": "0152cf185cd6cccb1eebf974fde9109dad776812",
  "dependencies": [
    "@amplication/kafka"
  ]
}]
```

## Example usage

```yaml
name: Get services hash example
on:
  workflow_dispatch:

jobs:
  get_services_hash_job:
    runs-on: ubuntu-18.04
    steps:
      - name: get services hash
        id: service-hashes
        uses: ./.github/actions/get-services-hash
        with:
          folders-to-hash: ${{ steps.find-folders.outputs.folders }}
          hash-ignore: '["node_modules/**", "lib/**", "dist/**", "**/*.spec.ts","__tests__/**","__mocks__/**","test/**","tests/**"]'

      - name: 'Usage example'
        run: |
          echo "${{ steps.service-hashes.outputs.service_hashes }}"
```
