import cli from "cli-ux";
import { ConfiguredCommand } from "../../configured-command";
import { getResource } from "../../api";
import { resource } from "../../flags/resource-flag";
import { format } from "../../flags/format-flag";
import { RESOURCE_COLUMNS } from "./index";

export default class ResourceInfo extends ConfiguredCommand {
  static description = "show detailed information for a resource";

  static examples = [
    "amp resources:info",
    "amp resources:info -r ckm1w4vy857869go3nsw4mk2ay",
  ];

  static flags = {
    ...cli.table.flags(),
    resource: resource(),
    format: format(),
  };

  async command() {
    const { flags } = this.parse(ResourceInfo);

    const resourceIdFlag = flags.resource;
    let resourceId = "";

    if (!resourceIdFlag) {
      resourceId = await cli.prompt("resource", { required: true });
    }

    const data = await getResource(this.client, resourceIdFlag || resourceId);
    this.output(data, flags, RESOURCE_COLUMNS);
  }
}
