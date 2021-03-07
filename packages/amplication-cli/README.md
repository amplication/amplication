# @amplication/cli

Amplication CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@amplication/cli.svg)](https://npmjs.org/package/@amplication/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@amplication/cli.svg)](https://npmjs.org/package/@amplication/cli)
[![License](https://img.shields.io/npm/l/@amplication/cli.svg)](https://github.com/noctifer20/cli/blob/master/package.json)

<!-- toc -->
* [@amplication/cli](#amplicationcli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @amplication/cli
$ amp COMMAND
running command...
$ amp (-v|--version|version)
@amplication/cli/0.0.1 win32-x64 node-v12.16.1
$ amp --help [COMMAND]
USAGE
  $ amp COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`amp apps`](#amp-apps)
* [`amp apps:create NAME [DESCRIPTION]`](#amp-appscreate-name-description)
* [`amp apps:current`](#amp-appscurrent)
* [`amp apps:info`](#amp-appsinfo)
* [`amp auth TOKEN`](#amp-auth-token)
* [`amp help [COMMAND]`](#amp-help-command)

## `amp apps`

```
USAGE
  $ amp apps
```

## `amp apps:create NAME [DESCRIPTION]`

```
USAGE
  $ amp apps:create NAME [DESCRIPTION]

ARGUMENTS
  NAME         name of app to create
  DESCRIPTION  description of app to create
```

## `amp apps:current`

```
USAGE
  $ amp apps:current

OPTIONS
  -a, --app=app  (required) ID of the app
```

## `amp apps:info`

```
USAGE
  $ amp apps:info

OPTIONS
  -a, --app=app  (required) app to run command against
```

## `amp auth TOKEN`

```
USAGE
  $ amp auth TOKEN
```

## `amp help [COMMAND]`

display help for amp

```
USAGE
  $ amp help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
