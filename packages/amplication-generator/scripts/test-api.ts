import assert from "assert";
import base64 from "base-64";
import fetch, { Response } from "node-fetch";

const JSON_MIME = "application/json";
const STATUS_OK = 200;
const STATUS_CREATED = 201;

if (require.main === module) {
  testAPI()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default async function testAPI(port: number = 3000) {
  console.info("Testing API...");
  let res: Response;
  const host = `http://0.0.0.0:${port}`;
  const username = "bob";
  const password = "password";
  const authorization = `Basic ${base64.encode(username + ":" + password)}`;

  console.info("POST /login");
  res = await fetch(`${host}/login`, {
    method: "POST",
    headers: {
      "Content-Type": JSON_MIME,
      Authorization: authorization,
    },
  });
  console.info(res.statusText);
  assert(res.status === STATUS_CREATED);
  console.info(await res.json());

  console.info("POST /customers");
  res = await fetch(`${host}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": JSON_MIME,
      Authorization: authorization,
    },
    body: JSON.stringify({
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Appleseed",
    }),
  });
  console.info(res.statusText);
  assert(res.status === STATUS_CREATED);
  console.info(await res.json());

  console.info("GET /customers");
  res = await fetch(`${host}/customers`, {
    headers: {
      Authorization: authorization,
    },
  });
  console.info(res.statusText);
  assert(res.status === STATUS_OK);
  const customers = await res.json();
  console.info(customers);
  const [{ id }] = customers;

  console.info(`GET /customers/${id}`);
  res = await fetch(`${host}/customers/${id}`, {
    headers: {
      Authorization: authorization,
    },
  });
  console.info(res.statusText);
  assert(res.status === STATUS_OK);
  console.info(await res.json());
}
