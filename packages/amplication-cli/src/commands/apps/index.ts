import cli, { Table } from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getApps } from '../../api';
import { format as formatFlag } from '../../flags/format-flag';

export const APP_COLUMNS: Table.table.Columns<any> = {
  id: {},
  name: {},
  description: {},
  color: {},
  githubSyncEnabled: {
    extended: true,
  },
  githubRepo: {
    extended: true,
  },
  githubBranch: {
    extended: true,
  },
  githubLastSync: {
    extended: true,
  },
  githubLastMessage: {
    extended: true,
  },
  githubTokenCreatedDate: {
    extended: true,
  },
  createdAt: {},
  updatedAt: {},
};

export default class AppsIndex extends ConfiguredCommand {
  static description = 'list all apps';

  static examples = [
    'amp apps',
    'amp apps --format=table',
    'amp apps --format=table --columns=id,name',
  ];

  static flags = {
    ...cli.table.flags(),
    format: formatFlag(),
  };

  async command() {
    const { flags } = this.parse(AppsIndex);

    console.log({ flags });

    const data = await getApps(this.client);

    this.output(data, flags, APP_COLUMNS);
  }
}
