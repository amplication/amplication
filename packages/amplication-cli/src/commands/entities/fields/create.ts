import cli from 'cli-ux';
import { ConfiguredCommand } from '../../../configured-command';
import chalk from 'chalk';
import { createFieldByDisplayName } from '../../../api';
import { format } from '../../../flags/format-flag';
import { entity } from '../../../flags/entity-flag';
import { FIELD_COLUMNS } from './index';

export default class FieldsCreate extends ConfiguredCommand {
  static flags = {
    ...cli.table.flags(),
    format: format(),
    entity: entity({
      required: true,
    }),
  };

  static args = [
    {
      name: 'displayName',
      required: true,
      description: 'display name of field to create',
    },
  ];

  async command() {
    const { args, flags } = this.parse(FieldsCreate);

    const displayName = args.displayName;
    const { entity } = flags;

    cli.action.start(`Creating new field ${chalk.green.bold(displayName)} `);

    const data = await createFieldByDisplayName(this.client, {
      displayName: displayName,
      entity: {
        connect: {
          id: entity,
        },
      },
    });

    cli.action.stop();
    this.output(data, flags, FIELD_COLUMNS);
  }
}
