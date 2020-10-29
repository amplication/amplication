import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import base64 from "base-64";
import * as compose from "docker-compose";
import getPort from "get-port";
import sleep from "sleep-promise";
import fetch from "node-fetch";
import generateTestDataService from "../scripts/generate-test-data-service";

// Use when running the E2E multiple times to shorten build time
const { NO_DELETE_IMAGE } = process.env;

const SERVER_START_TIMEOUT = 30000;

const JSON_MIME = "application/json";
const STATUS_OK = 200;
const STATUS_CREATED = 201;

const POSTGRESQL_USER = "admin";
const POSTGRESQL_PASSWORD = "admin";
const APP_USERNAME = "bob";
const APP_PASSWORD = "password";
const APP_BASIC_AUTHORIZATION = `Basic ${base64.encode(
  APP_USERNAME + ":" + APP_PASSWORD
)}`;
const EXAMPLE_CUSTOMER = {
  email: "alice@example.com",
  firstName: "Alice",
  lastName: "Appleseed",
  organization: null,
};
const EXAMPLE_ORGANIZATION = {
  name: "Amplication",
};

describe("Data Service Generator", () => {
  let dockerComposeOptions: compose.IDockerComposeOptions;
  let port: number;
  let host: string;
  let customer: { id: string };
  beforeAll(async () => {
    const directory = path.join(os.tmpdir(), "test-data-service");
    // Generate the test data service
    await generateTestDataService(directory);

    port = await getPort();
    const dbPort = await getPort();
    host = `http://0.0.0.0:${port}`;

    dockerComposeOptions = {
      cwd: directory,
      log: true,
      composeOptions: ["--project-name=e2e"],
      env: {
        ...process.env,
        POSTGRESQL_USER: POSTGRESQL_USER,
        POSTGRESQL_PASSWORD: POSTGRESQL_PASSWORD,
        POSTGRESQL_PORT: String(dbPort),
        SERVER_PORT: String(port),
      },
    };

    // Cleanup Docker Compose before run
    console.info("Cleaning up Docker Compose...");
    await down(dockerComposeOptions);

    // Run with Docker Compose
    console.info("Getting Docker Compose up...");

    // Always uses the -d flag due to non interactive mode
    await compose.upAll({
      ...dockerComposeOptions,
      commandOptions: ["--build", "--force-recreate"],
    });

    compose.logs([], { ...dockerComposeOptions, follow: true });

    console.info("Waiting for server to be ready...");
    await sleep(SERVER_START_TIMEOUT);

    console.info("Seeding database...");
    await compose.exec("server", "npm run seed", dockerComposeOptions);
  });

  afterAll(async () => {
    await down(dockerComposeOptions);
  });

  test("creates POST /login endpoint", async () => {
    const res = await fetch(`${host}/login`, {
      method: "POST",
      headers: {
        "Content-Type": JSON_MIME,
        Authorization: APP_BASIC_AUTHORIZATION,
      },
    });
    expect(res.status === STATUS_CREATED);
    expect(await res.json()).toEqual({
      id: expect.any(String),
      username: "bob",
      roles: ["user"],
    });
  });

  test("creates POST /customers endpoint", async () => {
    const res = await fetch(`${host}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": JSON_MIME,
        Authorization: APP_BASIC_AUTHORIZATION,
      },
      body: JSON.stringify(EXAMPLE_CUSTOMER),
    });
    expect(res.status === STATUS_CREATED);
    customer = await res.json();
    expect(customer).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ...EXAMPLE_CUSTOMER,
    });
  });

  test("creates POST /organization/:id/customers endpoint", async () => {
    const customer = await (
      await fetch(`${host}/organization`, {
        method: "POST",
        headers: {
          "Content-Type": JSON_MIME,
          Authorization: APP_BASIC_AUTHORIZATION,
        },
        body: JSON.stringify(EXAMPLE_CUSTOMER),
      })
    ).json();
    const organization = await (
      await fetch(`${host}/organization`, {
        method: "POST",
        headers: {
          "Content-Type": JSON_MIME,
          Authorization: APP_BASIC_AUTHORIZATION,
        },
        body: JSON.stringify(EXAMPLE_ORGANIZATION),
      })
    ).json();

    console.log(customer, organization);

    const res = await fetch(
      `${host}/organizations/${organization.id}/customers`,
      {
        method: "POST",
        headers: {
          "Content-Type": JSON_MIME,
          Authorization: APP_BASIC_AUTHORIZATION,
        },
        body: JSON.stringify([
          {
            id: customer.id,
          },
        ]),
      }
    );
    expect(res.status).toBe(STATUS_CREATED);
    const data = await res.json();
    expect(data).toBe(null);
  });

  test("creates GET /customers endpoint", async () => {
    const res = await fetch(`${host}/customers`, {
      headers: {
        Authorization: APP_BASIC_AUTHORIZATION,
      },
    });
    expect(res.status === STATUS_OK);
    const customers = await res.json();
    expect(customers).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        ...EXAMPLE_CUSTOMER,
      },
    ]);
  });

  test("creates GET /customers/:id endpoint", async () => {
    const res = await fetch(`${host}/customers/${customer.id}`, {
      headers: {
        Authorization: APP_BASIC_AUTHORIZATION,
      },
    });

    expect(res.status === STATUS_OK);
    expect(await res.json()).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ...EXAMPLE_CUSTOMER,
    });
  });
});

async function down(
  options: compose.IDockerComposeOptions
): Promise<compose.IDockerComposeResult> {
  console.info("Getting Docker Compose down...");
  return compose.down({
    ...options,
    commandOptions: NO_DELETE_IMAGE
      ? ["--volumes"]
      : ["--rmi=local", "--volumes"],
  });
}
