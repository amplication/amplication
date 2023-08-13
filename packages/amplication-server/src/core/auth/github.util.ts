import { Octokit } from "@octokit/rest";
import { orderBy } from "lodash";

export const GITHUB_USER_EMAILS_ROUTE = "GET /user/emails";
const GITHUB_NO_REPLY_DOMAIN = "@users.noreply.github.com";
const PUBLIC_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "qq.com",
  "yahoo.com",
  "163.com",
  "icloud.com",
  "live.com",
  "protonmail.com",
  "me.com",
  "mail.ru",
  "yandex.ru",
  "googlemail.com",
  "126.com",
  "gmx.de",
  "hotmail.fr",
  "outlook.fr",
  "foxmail.com",
  "hotmail.co.uk",
  "msn.com",
  "naver.com",
];

/**
 * @see https://docs.github.com/en/rest/reference/users#list-email-addresses-for-the-authenticated-user
 */
export async function getEmail(accessToken: string): Promise<string> {
  const octokit = new Octokit({
    auth: accessToken,
  });

  const results = await octokit.request(GITHUB_USER_EMAILS_ROUTE);

  const orderedList = orderBy(results.data, (item) => {
    if (!item.verified) return 4;
    if (item.email.endsWith(GITHUB_NO_REPLY_DOMAIN)) return 3;
    if (PUBLIC_DOMAINS.some((domain) => item.email.endsWith(domain))) return 2;
    return 1;
  });

  const [result] = orderedList;

  return (result as { email: string }).email;
}
