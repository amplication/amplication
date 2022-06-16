import cli from 'cli-ux';
import { flags } from '@oclif/command';
import { ConfiguredCommand } from '../../configured-command';
import chalk from 'chalk';
import { updateResource } from '../../api';
import { format } from '../../flags/format-flag';
import { resource } from '../../flags/resource-flag';
import { RESOURCE_COLUMNS } from './index';

export default class ResourcesUpdate extends ConfiguredCommand {
  static description = 'update an resource';

  static examples = [
    'amp resources:update --name="my new name"',
    'amp resources:update -r ckm1w4vy857869go3nsw4mk2ay --name "my new name"',
    'amp resources:update --name "my new name" --description "my new description"',
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    resource: resource(),

    name: flags.string({
      required: false,
      description: 'name of the resource',
    }),
    description: flags.string({
      required: false,
      description: 'description of the resource',
    }),
  };

  async command() {
    const { flags } = this.parse(ResourcesUpdate);

    const resourceId = flags.resource;
    if (!resourceId) {
      this.error(`Missing required flag: -r, --resource`);
    } else {
      const name = flags.name;
      const description = flags.description;

      cli.action.start(`Updating resource ${chalk.green.bold(resourceId)} `);

      const data = await updateResource(this.client, resourceId, {
        name,
        description,
      });

      cli.action.stop();
      this.output(data, flags, RESOURCE_COLUMNS);
    }
  }
}
