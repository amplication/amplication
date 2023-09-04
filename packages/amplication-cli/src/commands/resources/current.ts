import cli from "cli-ux";
import { ConfiguredCommand } from "../../configured-command";
import { getResource } from "../../api";
import { flags } from "@oclif/command";
import { format } from "../../flags/format-flag";
import { AMP_CURRENT_RESOURCE } from "../../properties";
import { RESOURCE_COLUMNS } from "./index";

export default class ResourcesCurrent extends ConfiguredCommand {
  static description = "set the current resource";

  static examples = ["amp resources:current -r ckm1w4vy857869go3nsw4mk2ay"];

  static flags = {
    ...cli.table.flags(),
    format: format(),

    resource: flags.string({
      char: "a",
      required: true,
      description: "ID of the resource",
    }),
  };

  async command() {
    const { flags } = this.parse(ResourcesCurrent);

    const resourceId = flags.resource;
    this.setConfig(AMP_CURRENT_RESOURCE, resourceId);

    const data = await getResource(this.client, resourceId);
    this.log(`Updated property ${AMP_CURRENT_RESOURCE}`);

    this.output(data, flags, RESOURCE_COLUMNS);
  }
}
