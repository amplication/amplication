@amplication/cli
================

Amplication CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@amplication/cli.svg)](https://npmjs.org/package/@amplication/cli)
[![CircleCI](https://circleci.com/gh/noctifer20/cli/tree/master.svg?style=shield)](https://circleci.com/gh/noctifer20/cli/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/@amplication/cli.svg)](https://npmjs.org/package/@amplication/cli)
[![License](https://img.shields.io/npm/l/@amplication/cli.svg)](https://github.com/noctifer20/cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @amplication/cli
$ amp-oc COMMAND
running command...
$ amp-oc (-v|--version|version)
@amplication/cli/0.2.0 linux-x64 node-v14.15.4
$ amp-oc --help [COMMAND]
USAGE
  $ amp-oc COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`amp-oc hello [FILE]`](#amp-oc-hello-file)
* [`amp-oc help [COMMAND]`](#amp-oc-help-command)

## `amp-oc hello [FILE]`

describe the command here

```
USAGE
  $ amp-oc hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ amp-oc hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/noctifer20/cli/blob/v0.2.0/src/commands/hello.ts)_

## `amp-oc help [COMMAND]`

display help for amp-oc

```
USAGE
  $ amp-oc help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
