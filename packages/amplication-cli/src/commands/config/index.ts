import { ConfiguredCommand } from "../../configured-command";
import { allowedProperties } from "../../properties";

export default class ConfigIndex extends ConfiguredCommand {
  static description = "list all supported properties";

  static examples = ["amp config"];

  async command() {
    for (const prop of allowedProperties)
      this.log(`${prop}=${this.getConfig(prop)}`);
  }
}
