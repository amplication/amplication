import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { flags } from '@oclif/command';
import chalk from 'chalk';
import pluralize from 'pluralize';
import { pascalCase } from 'pascal-case';
import { createEntity } from '../../api';
import { app } from '../../flags/app-flag';

export default class EntitiesCreate extends ConfiguredCommand {
  static flags = {
    app: app(),
    name: flags.string({
      required: false,
      description: 'name of the entity',
    }),
    pluralDisplayName: flags.string({
      required: false,
      description: 'plural display name of the entity',
    }),
    description: flags.string({
      required: false,
      description: 'description of the entity',
    }),
  };

  static args = [
    {
      name: 'displayName',
      required: true,
      description: 'display name of entity to create',
    },
  ];

  async command() {
    const { args, flags } = this.parse(EntitiesCreate);

    const displayName = args.displayName;
    const { app, name, pluralDisplayName, description } = flags;
    if (!app) {
      this.error(`Missing required flag: -a, --app`);
    } else {
      cli.action.start(`Creating new entity ${chalk.green.bold(displayName)} `);

      const finalName = name || pascalCase(displayName);
      const finalPluralDisplayName =
        pluralDisplayName || pluralize(displayName);

      const data = await createEntity(this.client, {
        app: {
          connect: {
            id: app,
          },
        },
        name: finalName,
        displayName,
        pluralDisplayName: finalPluralDisplayName,
        description,
      });

      cli.action.stop();
      cli.styledJSON(data);
    }
  }
}
