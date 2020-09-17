import { Octokit } from '@octokit/rest';

export const GITHUB_USER_EMAILS_ROUTE = 'GET /user/emails';

/**
 * @see https://docs.github.com/en/rest/reference/users#list-email-addresses-for-the-authenticated-user
 */
export async function getEmail(accessToken: string): Promise<string> {
  const octokit = new Octokit({
    auth: accessToken
  });
  const {
    data: [{ email }]
  } = await octokit.request(GITHUB_USER_EMAILS_ROUTE);
  return email;
}
