# Amplication Client/Server Authentication

Amplication client and server rely on GitHub OAuth mechanism to secure user interactions.

In order to configure GitHub auth and sync integration when running client and server locally, 
you can follow the steps below.

## Flow diagram

![Auth flow](https://github.com/amplication/amplication/blob/master/docs/auth/auth-flow.png)

## GitHub OAuth

Amplication leverage GitHub OAuth implementation that supports the standard [authorization code grant type](https://www.rfc-editor.org/rfc/rfc6749#section-4.1).

1. Login in your GitHub account and create a new GitHub OAuth application [here](https://github.com/settings/applications/new)
2. Fill the following details as in the [example](https://github.com/amplication/amplication/blob/master/docs/auth/github-oauth-app.png):
    ```jsonc
    Application Name:           "<your-github-username>-amplication-local"    
    Homepage URL:               "http://localhost:3001"
    Authorization callback URL: "http://localhost:3000/github/callback"
    ```
3. Hit Save
4. Hit `Generate new client secret` and copy the resulting secret
5. Clone [/packages/amplication-server/.env](https://github.com/amplication/amplication/blob/master/packages/amplication-server/.env) into `/packages/amplication-server/.env.local`
6. Update `/packages/amplication-server/.env.local` with the following variables
    ```sh
    GITHUB_REDIRECT_URI=http://localhost:3000/github/callback
    GITHUB_CLIENT_ID="replace with the github auth application client id"
    GITHUB_CLIENT_SECRET="replace with secret created as step 4""
    ```
5. Clone [/packages/amplication-client/.env](https://github.com/amplication/amplication/blob/master/packages/amplication-client/.env) into `/packages/amplication-client/.env.local`
6. Update `/packages/amplication-client/.env.local` with the following variables
    ```sh
    NX_REACT_APP_GITHUB_AUTH_ENABLED=true
    NX_REACT_APP_GITHUB_CONTROLLER_LOGIN_URL=http://localhost:3000/github
    ```

## GitHub app 

Amplication leverage GitHub Apps to integrate with GitHub and sync your generated code to the git GitHub remotes.

1. Login in your GitHub account and create a new GitHub App [here](https://github.com/settings/apps/new)
2. Fill the following details as in the [example](https://github.com/amplication/amplication/blob/master/docs/auth/github-oauth-app.png):
    ```jsonc
    Application Name:   "<your-github-username>-amplication-local"    
    Homepage URL:       "http://localhost:3001"
    Callback URL:       "http://localhost:3000/"
    Post Installation
     Setup Url:         "http://localhost:3001/github-auth-app/callback"
    Webhook: 
        Active:         "unchecked"
    Permissions
        Repository permissions
            Administration: "Access: Read and Write"
            Checks:         "Access: Read and Write"
            Content:        "Access: Read and Write"
    ```
3. Hit Save
4. Hit `Generate new client secret` and copy the resulting secret
5. Hit `Generate a private key`, download, open the generated certificate, add `\n` at the end of each line and join all lines to obtain a single line string
6. Clone [/packages/amplication-server/.env](https://github.com/amplication/amplication/blob/master/packages/amplication-server/.env) into `/packages/amplication-server/.env.local`
7. Update `/packages/amplication-server/.env.local` with the following variables
    ```sh
    # GitHub App (Git sync)
    GITHUB_APP_APP_ID="replace with the github App ID"
    GITHUB_APP_CLIENT_ID="replace with the github app Client ID"
    GITHUB_APP_CLIENT_SECRET="replace with secret created as step 4"
    GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----The key copied at step 4-----END RSA PRIVATE KEY-----"

    # replace <your-github-username>-amplication-local with your chosen name
    GITHUB_APP_INSTALLATION_URL='https://github.com/apps/<your-github-username>-amplication-local/installations/new?state={state}'
    ```
8. Clone [/packages/amplication-client/.env](https://github.com/amplication/amplication/blob/master/packages/amplication-client/.env) into `/packages/amplication-client/.env.local`
9. Update `/packages/amplication-client/.env.local` with the following variables
    ```sh
    NX_REACT_APP_GITHUB_AUTH_ENABLED=true
    NX_REACT_APP_GITHUB_CONTROLLER_LOGIN_URL=http://localhost:3000/github
    ```