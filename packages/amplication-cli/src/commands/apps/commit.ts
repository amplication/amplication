import cli, { Table } from 'cli-ux';
import { flags } from '@oclif/command';
import { ConfiguredCommand } from '../../configured-command';
import { commitChanges } from '../../api';
import { format } from '../../flags/format-flag';
import { app } from '../../flags/app-flag';
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

export default class AppsCommit extends ConfiguredCommand {
  static description = 'commit the pending changes in the app';

  static examples = ['amp apps:commit --message "adding customer entity"'];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    app: app(),

    message: flags.string({
      required: true,
      description: 'commit message',
    }),
  };

  async command() {
    const { flags } = this.parse(AppsCommit);

    const appId = flags.app;
    if (!appId) {
      this.error(`Missing required flag: -a, --app`);
    } else {
      const message = flags.message;

      cli.action.start(`Committing changes`);
      const data = await commitChanges(this.client, appId, message);

      cli.action.stop();
      this.output(data, flags, COMMIT_COLUMNS);
    }
  }
}
