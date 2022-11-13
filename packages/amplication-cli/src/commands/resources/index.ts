import cli, { Table } from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getResources } from '../../api';
import { format as formatFlag } from '../../flags/format-flag';

export const RESOURCE_COLUMNS: Table.table.Columns<any> = {
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

export default class ResourcesIndex extends ConfiguredCommand {
  static description = 'list all resources';

  static examples = [
    'amp resources',
    'amp resources --format=table',
    'amp resources --format=table --columns=id,name',
  ];

  static flags = {
    ...cli.table.flags(),
    format: formatFlag(),
  };

  async command() {
    const { flags } = this.parse(ResourcesIndex);

    console.log({ flags });

    const data = await getResources(this.client);

    this.output(data, flags, RESOURCE_COLUMNS);
  }
}
