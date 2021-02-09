import cli from 'cli-ux';
import { ConfiguredCommand } from '../configured-command';
import { gql } from '@apollo/client/core';

const DO_LOGIN = gql`
  mutation login($data: LoginInput!) {
    login(data: $data) {
      token
    }
  }
`;

export default class Login extends ConfiguredCommand {
  async command() {
    const email = await cli.prompt('email', {
      required: true,
    });
    const password = await cli.prompt('password', {
      required: true,
      type: 'hide',
    });

    if (email && password) {
      try {
        const tokenData = await this.client.mutate({
          mutation: DO_LOGIN,
          variables: {
            data: {
              email,
              password,
            },
          },
        });
        this.debug('tokenData:', tokenData);
        if (tokenData.data.login.token)
          this.setConfig('token', tokenData.data.login.token);
        this.log(`successfully logged in to Amplication with ${email}`);
      } catch (error) {
        this.error(error);
        this.error('Could not authorize user');
      }
    }
  }
}
