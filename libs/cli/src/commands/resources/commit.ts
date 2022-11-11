import cli, { Table } from 'cli-ux';
import { flags } from '@oclif/command';
import { ConfiguredCommand } from '../../configured-command';
import { commitChanges } from '../../api';
import { format } from '../../flags/format-flag';
import { resource } from '../../flags/resource-flag';
import * as models from '../../models';

export const COMMIT_COLUMNS: Table.table.Columns<models.Commit> = {
  id: {},
  userId: {},
  message: {},
  buildId: {
    get: (row) =>
      row.builds && row.builds.length ? `${row.builds[0].id}` : null,
  },
  createdAt: {},
  updatedAt: {},
};

export default class ResourcesCommit extends ConfiguredCommand {
  static description = 'commit the pending changes in the resource';

  static examples = ['amp resources:commit --message "adding customer entity"'];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    resource: resource(),

    message: flags.string({
      required: true,
      description: 'commit message',
    }),
  };

  async command() {
    const { flags } = this.parse(ResourcesCommit);

    const resourceId = flags.resource;
    if (!resourceId) {
      this.error(`Missing required flag: -r, --resource`);
    } else {
      const message = flags.message;

      cli.action.start(`Committing changes`);
      const data = await commitChanges(this.client, resourceId, message);

      cli.action.stop();
      this.output(data, flags, COMMIT_COLUMNS);
    }
  }
}
