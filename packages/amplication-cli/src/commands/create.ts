import cli from 'cli-ux';
import { ConfiguredCommand } from '../configured-command';
import { gql } from '@apollo/client/core';

import * as models from '../models';

const CREATE_APP = gql`
  mutation createApp($data: AppCreateInput!) {
    createApp(data: $data) {
      id
      name
      description
    }
  }
`;

export default class Login extends ConfiguredCommand {
  async command() {
    const name = await cli.prompt('name', { required: true });
    const description = await cli.prompt('description', { required: true });

    if (name && description) {
      try {
        const data = await this.client.mutate<{ createApp: models.App }>({
          mutation: CREATE_APP,
          variables: {
            data: {
              name,
              description,
            },
          },
        });

        this.log(`successfully created app '${name}'`);
        this.log(`App ID  ${data.data?.createApp.id}`);
      } catch (error) {
        this.error('Could not authorize user');
      }
    }
  }
}
