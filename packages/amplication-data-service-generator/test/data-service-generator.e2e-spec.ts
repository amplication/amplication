import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import base64 from "base-64";
import * as compose from "docker-compose";
import getPort from "get-port";
import sleep from "sleep-promise";
import fetch, { Response } from "node-fetch";
import generateTestDataService from "../scripts/generate-test-data-service";

// Use when running the E2E multiple times to shorten build time
const { NO_DELETE_IMAGE } = process.env;

const SERVER_START_TIMEOUT = 30000;

const JSON_MIME = "application/json";
const STATUS_OK = 200;
const STATUS_CREATED = 201;
const SEED_FILE_PATH = require.resolve("./seed.ts");
const SEED_FILE_NAME = "seed.ts";

describe("Data Service Generator", () => {
  let dockerComposeOptions: compose.IDockerComposeOptions;
  let port: number;
  beforeAll(async () => {
    const directory = path.join(os.tmpdir(), "test-data-service");
    // Generate the test data service
    await generateTestDataService(directory);
    // Add the seed script
    await addSeedScript(directory);

    port = await getPort();
    const dbPort = await getPort();
    const user = "admin";
    const password = "admin";

    dockerComposeOptions = {
      cwd: directory,
      log: true,
      composeOptions: ["--project-name=e2e"],
      env: {
        ...process.env,
        POSTGRESQL_USER: user,
        POSTGRESQL_PASSWORD: password,
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
    await compose.exec(
      "server",
      `npx ts-node ${SEED_FILE_NAME}`,
      dockerComposeOptions
    );
  });

  afterAll(async () => {
    await down(dockerComposeOptions);
  });

  test("api", async () => {
    console.info("Testing API...");
    let res: Response;
    const host = `http://0.0.0.0:${port}`;
    const username = "bob";
    const password = "password";
    const authorization = `Basic ${base64.encode(username + ":" + password)}`;

    res = await fetch(`${host}/login`, {
      method: "POST",
      headers: {
        "Content-Type": JSON_MIME,
        Authorization: authorization,
      },
    });
    expect(res.status === STATUS_CREATED);
    expect(await res.json()).toEqual({
      id: expect.any(String),
      username: "bob",
      roles: ["user"],
    });

    const customer = {
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Appleseed",
    };
    res = await fetch(`${host}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": JSON_MIME,
        Authorization: authorization,
      },
      body: JSON.stringify(customer),
    });
    expect(res.status === STATUS_CREATED);
    expect(await res.json()).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ...customer,
    });

    res = await fetch(`${host}/customers`, {
      headers: {
        Authorization: authorization,
      },
    });
    expect(res.status === STATUS_OK);
    const customers = await res.json();
    expect(customers).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        ...customer,
      },
    ]);
    const [{ id }] = customers;

    res = await fetch(`${host}/customers/${id}`, {
      headers: {
        Authorization: authorization,
      },
    });

    expect(res.status === STATUS_OK);
    expect(await res.json()).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ...customer,
    });
  });
});

async function addSeedScript(directory: string): Promise<void> {
  await fs.promises.copyFile(
    SEED_FILE_PATH,
    path.join(directory, SEED_FILE_NAME)
  );
}

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
