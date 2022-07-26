# Get package names

Get package names is a GitHub action that returns corresponding package names for a given list of folders. The action is to search for the package name from the package.json files. In case a package is not found, or the package.json is not containing the package name, the folder will be discarded and will not be in the action output

## Inputs

`folders`- list of folders with their package names
```json
[ "folder-1", "folder-2" ] 
```

## Outputs

`package_names` - list of folders with their package names
```json
[{
  "folder": "folder-1",
  "name": "package-name-1"
},
  {
    "folder": "folder-2",
    "name": "package-name-2"
  }]
```

## Example usage

```yaml
name: Get folders package names example
on:
  workflow_dispatch:

jobs:
  Get_folders_package_names_job:
    runs-on: ubuntu-18.04
    steps:
      - name: 'Get folders package names'
        id: folders-package-name
        uses: ./.github/actions/get-package-names
        with:
          folders: [ "folder-1", "folder-2"]

      - name: 'Usage example'
        run: |
          echo "${{ steps.folders-package-name.outputs.package_names }}"
```
