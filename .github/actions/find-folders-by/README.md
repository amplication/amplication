# Create services hash action

This action find folders that contain specific files

## Outputs

## `folders`

A list of folders

### Service Hash Element

## Example usage

```yaml
name: Find folders example
on:
  workflow_dispatch:

jobs:
  find_folders_job:
    runs-on: ubuntu-18.04
    steps:
      - name: 'Find folders that containing Dockerfile'
        id: find-folders
        uses: ./.github/actions/find-folders
        with:
          files-to-find: ['Dockerfile']
          include-folders: ['ee/packages', 'packages']
          ignore-folders:
            [
              'node_modules',
              'lib',
              'dist',
              'bin',
              'src',
              '__mocks__',
              'public',
              'scripts',
              'test',
              'prisma',
              'graphql',
              'generated',
            ]
          search-recursive: true

      - name: 'Usage example'
        run: |
          echo "${{ steps.find-folders.outputs.folders }}"
```
