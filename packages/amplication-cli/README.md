# @amplication/cli 

Amplication CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@amplication/cli.svg)](https://npmjs.org/package/@amplication/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@amplication/cli.svg)](https://npmjs.org/package/@amplication/cli)

<!-- toc -->

- [@amplication/cli](#amplicationcli)
- [Usage](#usage)
- [Setup](#setup)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @amplication/cli
$ amp COMMAND
running command...
$ amp (-v|--version|version)
@amplication/cli/0.1.4 win32-x64 node-v12.16.1
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
- [`amp entities:info`](#amp-entitiesinfo)
- [`amp entities:update`](#amp-entitiesupdate)
- [`amp help [COMMAND]`](#amp-help-command)

## `amp apps`

list all apps

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

EXAMPLES
  amp apps
  amp apps --format=table
  amp apps --format=table --columns=id,name
```

## `amp apps:commit`

commit the pending changes in the app

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

EXAMPLE
  amp apps:commit --message "adding customer entity"
```

## `amp apps:create NAME [DESCRIPTION]`

create a new app

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

EXAMPLE
  amp apps:create "my cool app" "my app description" --set-current
```

## `amp apps:current`

set the current app

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

EXAMPLE
  amp apps:current -a ckm1w4vy857869go3nsw4mk2ay
```

## `amp apps:info`

show detailed information for an app

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

EXAMPLES
  amp apps:info
  amp apps:info -a ckm1w4vy857869go3nsw4mk2ay
```

## `amp apps:update`

update an app

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

EXAMPLES
  amp apps:update --name="my new name"
  amp apps:update -a ckm1w4vy857869go3nsw4mk2ay --name "my new name"
  amp apps:update --name "my new name" --description "my new description"
```

## `amp auth TOKEN`

```
USAGE
  $ amp auth TOKEN
```

## `amp config`

list all supported properties

```
USAGE
  $ amp config

EXAMPLE
  amp config
```

## `amp config:get PROPERTY`

get a property value

```
USAGE
  $ amp config:get PROPERTY

ARGUMENTS
  PROPERTY  name of property

EXAMPLES
  amp config:get AMP_CURRENT_APP
  amp config:get AMP_SERVER_URL
  amp config:get AMP_OUTPUT_FORMAT
```

## `amp config:set PROPERTY VALUE`

set a property value

```
USAGE
  $ amp config:set PROPERTY VALUE

ARGUMENTS
  PROPERTY  name of property
  VALUE     value of property

EXAMPLES
  amp config:set AMP_CURRENT_APP ckm1w4vy857869go3nsw4mk2ay
  amp config:set AMP_SERVER_URL https://app.amplication.com
  amp config:set AMP_OUTPUT_FORMAT styledJSON
```

## `amp config:unset PROPERTY`

unset a property value

```
USAGE
  $ amp config:unset PROPERTY

ARGUMENTS
  PROPERTY  name of property

EXAMPLE
  amp config:unset AMP_CURRENT_APP
```

## `amp entities`

list entities for an app

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

EXAMPLES
  amp entities
  amp entities -a ckm1w4vy857869go3nsw4mk2ay
  amp entities --format=table
```

## `amp entities:create DISPLAYNAME`

create an entity

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

EXAMPLES
  amp entities:create Customer --set-current
  amp entities:create Customer -a ckm1w4vy857869go3nsw4mk2ay
  amp entities:create Customer
```

## `amp entities:fields`

list fields for an entity

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

EXAMPLES
  amp entities:fields
  amp entities:fields -e ckm1wl4ru58969go3n3mt2zkg2
  amp entities:fields --format=table
```

## `amp entities:fields:create DISPLAYNAME`

create a field

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

EXAMPLES
  amp entities:fields:create "Start Date" --set-current
  amp entities:fields:create "Start Date" -e ckm1wl4ru58969go3n3mt2zkg2
  amp entities:fields:create "Start Date"
```

## `amp entities:fields:update`

update a field

```
USAGE
  $ amp entities:fields:update

OPTIONS
  -f, --field=field                   (required) ID of the field
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --description=description           set the description of the field
  --displayName=displayName           set the display name of the field
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --name=name                         set the name of the field
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --[no-]required                     set the field as required, or not
  --[no-]searchable                   set the field as searchable, or not
  --sort=sort                         property to sort by (prepend '-' for descending)

EXAMPLES
  amp entities:fields:update --name="my new field name"
  amp entities:fields:update -f ckm1xt4mm63197go3nt8n2py80 --name "my new field name"
  amp entities:fields:update --required
  amp entities:fields:update --no-required
```

## `amp entities:info`

show detailed information for an entity

```
USAGE
  $ amp entities:info

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

EXAMPLES
  amp entities:info
  amp entities:info -e ckm1wl4ru58969go3n3mt2zkg2
```

## `amp entities:update`

update an entity

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

EXAMPLES
  amp entities:update --name="my new entity name"
  amp entities:update -e ckm1wl4ru58969go3n3mt2zkg2 --name "my new entity name" --description "my new entity
  description"
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
