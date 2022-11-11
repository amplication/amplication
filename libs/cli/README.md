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
@amplication/cli/0.13.0 darwin-arm64 node-v16.14.0
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
- [`amp resources`](#amp-resources)
- [`amp resources:commit`](#amp-resourcescommit)
- [`amp resources:create NAME [DESCRIPTION]`](#amp-resourcescreate-name-description)
- [`amp resources:current`](#amp-resourcescurrent)
- [`amp resources:info`](#amp-resourcesinfo)
- [`amp resources:update`](#amp-resourcesupdate)

## `amp auth TOKEN`

authenticate using token generated on amplication server UI

```
USAGE
  $ amp auth TOKEN
```

_See code: [src/commands/auth.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/auth.ts)_

## `amp config`

list all supported properties

```
USAGE
  $ amp config

EXAMPLE
  amp config
```

_See code: [src/commands/config/index.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/config/index.ts)_

## `amp config:get PROPERTY`

get a property value

```
USAGE
  $ amp config:get PROPERTY

ARGUMENTS
  PROPERTY  name of property

EXAMPLES
  amp config:get AMP_CURRENT_RESOURCE
  amp config:get AMP_SERVER_URL
  amp config:get AMP_OUTPUT_FORMAT
```

_See code: [src/commands/config/get.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/config/get.ts)_

## `amp config:set PROPERTY VALUE`

set a property value

```
USAGE
  $ amp config:set PROPERTY VALUE

ARGUMENTS
  PROPERTY  name of property
  VALUE     value of property

EXAMPLES
  amp config:set AMP_CURRENT_RESOURCE ckm1w4vy857869go3nsw4mk2ay
  amp config:set AMP_SERVER_URL https://app.amplication.com
  amp config:set AMP_OUTPUT_FORMAT styledJSON
```

_See code: [src/commands/config/set.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/config/set.ts)_

## `amp config:unset PROPERTY`

unset a property value

```
USAGE
  $ amp config:unset PROPERTY

ARGUMENTS
  PROPERTY  name of property

EXAMPLE
  amp config:unset AMP_CURRENT_RESOURCE
```

_See code: [src/commands/config/unset.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/config/unset.ts)_

## `amp entities`

list entities for a resource

```
USAGE
  $ amp entities

OPTIONS
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -r, --resource=resource             resource to run command against
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
  amp entities -r ckm1w4vy857869go3nsw4mk2ay
  amp entities --format=table
```

_See code: [src/commands/entities/index.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/entities/index.ts)_

## `amp entities:create DISPLAYNAME`

create an entity

```
USAGE
  $ amp entities:create DISPLAYNAME

ARGUMENTS
  DISPLAYNAME  display name of entity to create

OPTIONS
  -f, --format=JSON|styledJSON|table     [default: JSON] The format in which to render the output
  -r, --resource=resource                resource to run command against
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
  amp entities:create Customer -r ckm1w4vy857869go3nsw4mk2ay
  amp entities:create Customer
```

_See code: [src/commands/entities/create.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/entities/create.ts)_

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

_See code: [src/commands/entities/fields/index.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/entities/fields/index.ts)_

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

_See code: [src/commands/entities/fields/create.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/entities/fields/create.ts)_

## `amp entities:fields:update`

update a field

```
USAGE
  $ amp entities:fields:update

OPTIONS
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -i, --field=field                   (required) ID of the field
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

_See code: [src/commands/entities/fields/update.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/entities/fields/update.ts)_

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

_See code: [src/commands/entities/info.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/entities/info.ts)_

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

_See code: [src/commands/entities/update.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/entities/update.ts)_

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

## `amp resources`

list all resources

```
USAGE
  $ amp resources

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
  amp resources
  amp resources --format=table
  amp resources --format=table --columns=id,name
```

_See code: [src/commands/resources/index.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/resources/index.ts)_

## `amp resources:commit`

commit the pending changes in the resource

```
USAGE
  $ amp resources:commit

OPTIONS
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -r, --resource=resource             resource to run command against
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
  amp resources:commit --message "adding customer entity"
```

_See code: [src/commands/resources/commit.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/resources/commit.ts)_

## `amp resources:create NAME [DESCRIPTION]`

create a new resource

```
USAGE
  $ amp resources:create NAME [DESCRIPTION]

ARGUMENTS
  NAME         name of resource to create
  DESCRIPTION  description of resource to create

OPTIONS
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --set-current                       set the newly created resource as the current resource
  --sort=sort                         property to sort by (prepend '-' for descending)

EXAMPLE
  amp resources:create "my cool resource" "my resource description" --set-current
```

_See code: [src/commands/resources/create.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/resources/create.ts)_

## `amp resources:current`

set the current resource

```
USAGE
  $ amp resources:current

OPTIONS
  -a, --resource=resource             (required) ID of the resource
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
  amp resources:current -r ckm1w4vy857869go3nsw4mk2ay
```

_See code: [src/commands/resources/current.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/resources/current.ts)_

## `amp resources:info`

show detailed information for a resource

```
USAGE
  $ amp resources:info

OPTIONS
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -r, --resource=resource             resource to run command against
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --sort=sort                         property to sort by (prepend '-' for descending)

EXAMPLES
  amp resources:info
  amp resources:info -r ckm1w4vy857869go3nsw4mk2ay
```

_See code: [src/commands/resources/info.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/resources/info.ts)_

## `amp resources:update`

update a resource

```
USAGE
  $ amp resources:update

OPTIONS
  -f, --format=JSON|styledJSON|table  [default: JSON] The format in which to render the output
  -r, --resource=resource             resource to run command against
  -x, --extended                      show extra columns
  --columns=columns                   only show provided columns (comma-separated)
  --csv                               output is csv format [alias: --output=csv]
  --description=description           description of the resource
  --filter=filter                     filter property by partial string matching, ex: name=foo
  --name=name                         name of the resource
  --no-header                         hide table header from output
  --no-truncate                       do not truncate output to fit screen
  --output=csv|json|yaml              output in a more machine friendly format
  --sort=sort                         property to sort by (prepend '-' for descending)

EXAMPLES
  amp resources:update --name="my new name"
  amp resources:update -r ckm1w4vy857869go3nsw4mk2ay --name "my new name"
  amp resources:update --name "my new name" --description "my new description"
```

_See code: [src/commands/resources/update.ts](https://github.com/amplication/amplication/blob/v0.13.0/src/commands/resources/update.ts)_

<!-- commandsstop -->
