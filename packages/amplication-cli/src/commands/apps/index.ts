import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getApps } from '../../api';
import { format as formatFlag } from '../../flags/format-flag';

export default class AppsIndex extends ConfiguredCommand {
  static flags = {
    ...cli.table.flags(),
    format: formatFlag(),
  };

  async command() {
    const { flags } = this.parse(AppsIndex);

    console.log({ flags });

    const data = await getApps(this.client);

    this.output(data, flags, { id: {}, name: {}, description: {} });
  }
}
