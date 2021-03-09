import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { flags } from '@oclif/command';
import chalk from 'chalk';
import pluralize from 'pluralize';
import { pascalCase } from 'pascal-case';
import { createEntity } from '../../api';
import { format } from '../../flags/format-flag';
import { app } from '../../flags/app-flag';
import { ENTITY_COLUMNS } from './index';
import { AMP_CURRENT_ENTITY } from '../../properties';

export default class EntitiesCreate extends ConfiguredCommand {
  static description = 'create an entity';

  static examples = [
    'amp entities:create Customer --set-current',
    'amp entities:create Customer -a ckm1w4vy857869go3nsw4mk2ay',
    'amp entities:create Customer ',
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
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
    ['set-current']: flags.boolean({
      default: false,
      description: 'set the newly created entity as the current entity',
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

      if (flags['set-current'] === true) {
        this.setConfig(AMP_CURRENT_ENTITY, data.id);
        this.log(`Property updated - ${AMP_CURRENT_ENTITY}=${data.id}`);
      }

      cli.action.stop();
      this.output(data, flags, ENTITY_COLUMNS);
    }
  }
}
