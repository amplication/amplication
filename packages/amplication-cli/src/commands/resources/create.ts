import cli from "cli-ux";
import { flags } from "@oclif/command";
import { ConfiguredCommand } from "../../configured-command";
import chalk from "chalk";
import { createService } from "../../api";
import { format } from "../../flags/format-flag";
import { RESOURCE_COLUMNS } from "./index";
import { AMP_CURRENT_RESOURCE } from "../../properties";
import { EnumResourceType } from "../../models";

export default class ResourcesCreate extends ConfiguredCommand {
  static description = "create a new resource";

  static examples = [
    'amp resources:create "my cool resource" "my resource description" --set-current',
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    ["set-current"]: flags.boolean({
      default: false,
      description: "set the newly created resource as the current resource",
    }),
  };

  static args = [
    {
      name: "name",
      required: true,
      description: "name of resource to create",
    },
    {
      name: "description",
      required: false,
      description: "description of resource to create",
    },
    {
      name: "projectId",
      required: true,
      description: "project id of the created resource",
    },
  ];

  async command() {
    const { args, flags } = this.parse(ResourcesCreate);

    const name = args.name;
    const description = args.description;
    const projectId = args.projectId;

    cli.action.start(`Creating new resource ${chalk.green.bold(name)} `);

    const data = await createService(
      this.client,
      name,
      description || "",
      EnumResourceType.Service, //TODO change to get input from the user
      projectId
    );

    if (flags["set-current"] === true) {
      this.setConfig(AMP_CURRENT_RESOURCE, data.id);
      this.log(`Property updated - ${AMP_CURRENT_RESOURCE}=${data.id}`);
    }

    cli.action.stop();
    this.output(data, flags, RESOURCE_COLUMNS);
  }
}
