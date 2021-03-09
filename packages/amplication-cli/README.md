# @amplication/cli

Amplication CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@amplication/cli.svg)](https://npmjs.org/package/@amplication/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@amplication/cli.svg)](https://npmjs.org/package/@amplication/cli)
[![License](https://img.shields.io/npm/l/@amplication/cli.svg)](https://github.com/noctifer20/cli/blob/master/package.json)

<!-- toc -->

- [@amplication/cli](#amplicationcli)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @amplication/cli
$ amp COMMAND
running command...
$ amp (-v|--version|version)
@amplication/cli/0.0.2 win32-x64 node-v12.16.1
$ amp --help [COMMAND]
USAGE
  $ amp COMMAND
...
```

<!-- usagestop -->

# Setup

## Authentication

Generate a token on Amplication server UI and use the token with the following command:

```sh-session
$ amp auth TOKEN

```

## Changing Amplication server url

By default, Amplication CLI works with the hosted version on https://app.amplication.com.
In case you want to use the CLI with another Amplication version, you can use the config:set command

```sh-session
$ amp config:set AMP_SERVER_URL http://localhost:3000

```

# Commands

<!-- commands -->

- [`amp apps`](#amp-apps)
- [`amp apps:commit`](#amp-appscommit)
- [`amp apps:create NAME [DESCRIPTION]`](#amp-appscreate-name-description)
- [`amp apps:current`](#amp-appscurrent)
- [`amp apps:info`](#amp-appsinfo)
- [`amp apps:update`](#amp-appsupdate)
- [`amp auth TOKEN`](#amp-auth-token)
- [`amp config`](#amp-config)
- [`amp config:get PROPERTY`](#amp-configget-property)
- [`amp config:set PROPERTY VALUE`](#amp-configset-property-value)
- [`amp config:unset PROPERTY`](#amp-configunset-property)
- [`amp entities`](#amp-entities)
- [`amp entities:create DISPLAYNAME`](#amp-entitiescreate-displayname)
- [`amp entities:fields`](#amp-entitiesfields)
- [`amp entities:fields:create DISPLAYNAME`](#amp-entitiesfieldscreate-displayname)
- [`amp entities:fields:update`](#amp-entitiesfieldsupdate)
- [`amp entities:info ENTITY`](#amp-entitiesinfo-entity)
- [`amp entities:update`](#amp-entitiesupdate)
- [`amp help [COMMAND]`](#amp-help-command)

## `amp apps`

```
USAGE
  $ amp apps

OPTIONS
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp apps:commit`

```
USAGE
  $ amp apps:commit

OPTIONS
  -a, --app=app                       app to run command against
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --message=message                   (required) commit message
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp apps:create NAME [DESCRIPTION]`

```
USAGE
  $ amp apps:create NAME [DESCRIPTION]

ARGUMENTS
  NAME         name of app to create
  DESCRIPTION  description of app to create

OPTIONS
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --set-current                       set the newly created app as the current app
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp apps:current`

```
USAGE
  $ amp apps:current

OPTIONS
  -a, --app=app                       (required) ID of the app
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp apps:info`

```
USAGE
  $ amp apps:info

OPTIONS
  -a, --app=app                       app to run command against
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp apps:update`

```
USAGE
  $ amp apps:update

OPTIONS
  -a, --app=app                       app to run command against
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --description=description           description of the app
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --name=name                         name of the app
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp auth TOKEN`

```
USAGE
  $ amp auth TOKEN
```

## `amp config`

```
USAGE
  $ amp config
```

## `amp config:get PROPERTY`

```
USAGE
  $ amp config:get PROPERTY

ARGUMENTS
  PROPERTY  name of property
```

## `amp config:set PROPERTY VALUE`

```
USAGE
  $ amp config:set PROPERTY VALUE

ARGUMENTS
  PROPERTY  name of property
  VALUE     value of property
```

## `amp config:unset PROPERTY`

```
USAGE
  $ amp config:unset PROPERTY

ARGUMENTS
  PROPERTY  name of property
```

## `amp entities`

```
USAGE
  $ amp entities

OPTIONS
  -a, --app=app                       app to run command against
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp entities:create DISPLAYNAME`

```
USAGE
  $ amp entities:create DISPLAYNAME

ARGUMENTS
  DISPLAYNAME  display name of entity to create

OPTIONS
  -a, --app=app                          app to run command against
  -f, --format=JSON|styledJSON|table     [default: JSON] The format in which to render the output
  -x, --extended                         show extra columns
  --columns=columns                      only show provided columns (comma-separated)
  --csv                                  output is csv format [alias: --output=csv]
  --description=description              description of the entity
  --filter=filter                        filter property by partial string matching, ex: name=foo
  --name=name                            name of the entity
  --no-header                            hide table header from output
  --no-truncate                          do not truncate output to fit screen
  --output=csv|json|yaml                 output in a more machine friendly format
  --pluralDisplayName=pluralDisplayName  plural display name of the entity
  --set-current                          set the newly created entity as the current entity
  --sort=sort                            property to sort by (prepend '-' for descending)
```

## `amp entities:fields`

```
USAGE
  $ amp entities:fields

OPTIONS
  -e, --entity=entity                 (required) ID of the entity
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp entities:fields:create DISPLAYNAME`

```
USAGE
  $ amp entities:fields:create DISPLAYNAME

ARGUMENTS
  DISPLAYNAME  display name of field to create

OPTIONS
  -e, --entity=entity                 (required) ID of the entity
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --set-current                       set the newly created field as the current field
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp entities:fields:update`

```
USAGE
  $ amp entities:fields:update

OPTIONS
  -f, --field=field                   (required) ID of the field
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --description=description           description of the field
  --displayName=displayName           display name of the field
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --name=name                         name of the field
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --required                          set the field as required
  --searchable                        set the field as searchable
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp entities:info ENTITY`

```
USAGE
  $ amp entities:info ENTITY

ARGUMENTS
  ENTITY  id of entity

OPTIONS
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --sort=sort                         property to sort by (prepend '-' for descending)
```

## `amp entities:update`

```
USAGE
  $ amp entities:update

OPTIONS
  -e, --entity=entity                    (required) ID of the entity
  -f, --format=JSON|styledJSON|table     [default: JSON] The format in which to render the output
  -x, --extended                         show extra columns
  --columns=columns                      only show provided columns (comma-separated)
  --csv                                  output is csv format [alias: --output=csv]
  --description=description              description of the entity
  --displayName=displayName              display name of the entity
  --filter=filter                        filter property by partial string matching, ex: name=foo
  --name=name                            name of the entity
  --no-header                            hide table header from output
  --no-truncate                          do not truncate output to fit screen
  --output=csv|json|yaml                 output in a more machine friendly format
  --pluralDisplayName=pluralDisplayName  plural display name of the entity
  --sort=sort                            property to sort by (prepend '-' for descending)
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
