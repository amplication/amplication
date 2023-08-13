import { ConfiguredCommand } from "../configured-command";
import { gql } from "@apollo/client/core";
import * as models from "../models";

type TData = {
  me: models.User;
};

const AUTH_QUERY = gql`
  query auth {
    me {
      id
      account {
        firstName
        lastName
      }
    }
  }
`;

export default class Auth extends ConfiguredCommand {
  static description =
    "authenticate using token generated on amplication server UI";

  static args = [{ name: "token", required: true }];

  async command() {
    const { args } = this.parse(Auth);
    this.setConfig("token", args.token);

    try {
      const authData = await this.client.query<TData>({
        query: AUTH_QUERY,
      });
      this.debug("tokenData:", authData);
      if (authData.data.me.id)
        this.log(
          `successfully logged in to Amplication with user ${authData.data.me.account?.firstName} ${authData.data.me.account?.lastName}`
        );
    } catch (error) {
      this.error("Could not authorize user");
    }
  }
}
