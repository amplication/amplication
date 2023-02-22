import fetch from "node-fetch";

const AUTHORIZE_URL = "https://bitbucket.org/site/oauth2/authorize";
const ACCESS_TOKEN_URL = "https://bitbucket.org/site/oauth2/access_token";
const CURRENT_USER_URL = "https://api.bitbucket.org/2.0/user";

export const authDataRequest = async (
  clientId: string,
  clientSecret: string,
  code: string
) => {
  return fetch(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
    body: `grant_type=authorization_code&code=${code}`,
  });
};

export const currentUserRequest = async (accessToken: string) => {
  return fetch(CURRENT_USER_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
};
