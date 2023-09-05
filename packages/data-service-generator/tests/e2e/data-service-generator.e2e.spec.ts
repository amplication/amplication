import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import * as compose from "docker-compose";
import getPort from "get-port";
import sleep from "sleep-promise";
import fetch from "cross-fetch";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { generateCodeByResourceData } from "../../src/generate-code";
import { EnumDataType, EnumResourceType } from "../../src/models";
import { Logger, LogLevel } from "@amplication/util/logging";
import { omit } from "lodash";
import env from "./env";
import entities from "./data/base/entities";
import { resourceInfo } from "./data/base/resourceInfo";
import roles from "./data/base/roles";
import { basicAuth, mongo, mysql, postgres } from "./plugins";

// Use when running the E2E multiple times to shorten build time
const { NO_DELETE_IMAGE } = process.env;

const SERVER_START_TIMEOUT = 30000;

const JSON_MIME = "application/json";
const STATUS_OK = 200;
const STATUS_CREATED = 201;
const NOT_FOUND = 404;

const {
  APP_USERNAME,
  APP_PASSWORD,
  APP_DEFAULT_USER_ROLES,
  APP_BASIC_AUTHORIZATION,
} = env;

const EXAMPLE_CUSTOMER = {
  email: "alice@example.com",
  firstName: "Alice",
  lastName: "Appleseed",
  organization: null,
};
const EXAMPLE_CUSTOMER_UPDATE = { firstName: "Bob" };
const EXAMPLE_ORGANIZATION = {
  name: "Amplication",
};

const verbose = process.env.VERBOSE ? true : false;
const logger = new Logger({
  isProduction: false,
  component: "dsg-e2e",
  logLevel: verbose ? LogLevel.Debug : LogLevel.Warn,
});

describe("Data Service Generator", () => {
  let dockerComposeOptions: compose.IDockerComposeOptions;
  let port: number;
  let dbPort: number;
  let host: string;
  let customer: { id: number };
  let apolloClient: ApolloClient<any>;

  const pluginTests = [
    { desc: "basic auth and postgres", plugins: [...postgres, ...basicAuth] },
    { desc: "basic auth and mysql", plugins: [...mysql, ...basicAuth] },
    { desc: "basic auth and mongo", plugins: [...mongo, ...basicAuth] },
  ];

  describe.each(pluginTests)(
    "for a service with $desc plugins",
    ({ desc, plugins }) => {
      const testId = desc.replace(/\s+/g, "-").toLowerCase();

      beforeAll(async () => {
        const directory = path.join(os.tmpdir(), "test-data-service", testId);
        // Clean the temporary directory
        try {
          await fs.promises.rm(directory, { recursive: true });
        } catch {
          /* empty */
        }
        await fs.promises.mkdir(directory, { recursive: true });
        let mockEntities = entities;

        // remove entity fieds not supported by mysql
        if (plugins.find((plugin) => plugin.npm.indexOf("plugin-db-mysql"))) {
          mockEntities = entities.map((entity) => {
            entity.fields = entity.fields.filter(
              (field) => field.dataType !== EnumDataType.MultiSelectOptionSet
            );
            return entity;
          });
        }

        // Generate the test data service
        const testResourceData = {
          entities: mockEntities,
          roles,
          resourceInfo,
          buildId: "example_build_id",
          resourceType: EnumResourceType.Service,
          pluginInstallations: plugins,
        };

        logger.info("Starting code generation", {
          directory,
        });

        try {
          await generateCodeByResourceData(testResourceData, directory);
        } catch (error) {
          logger.error("Failed to generate code", error);
        }

        port = await getPort();
        dbPort = await getPort();

        host = `http://0.0.0.0:${port}`;
        ``;
        const authLink = setContext((_, { headers }) => ({
          headers: {
            ...headers,
            authorization: APP_BASIC_AUTHORIZATION,
          },
        }));

        const errorLink = onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
              logger.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                null,
                { graphQLErrors }
              )
            );

          if (networkError)
            logger.error(`[Network error]: ${networkError}`, networkError);
        });

        const httpLink = createHttpLink({
          uri: `${host}/graphql`,
          fetch,
        });

        apolloClient = new ApolloClient({
          link: authLink.concat(errorLink).concat(httpLink),
          cache: new InMemoryCache(),
        });

        const dockerComposeDir = path.join(directory, "server");
        const dotEnvPath = path.join(dockerComposeDir, ".env");

        dockerComposeOptions = {
          cwd: dockerComposeDir,
          log: verbose,
          composeOptions: [
            `--project-name=e2e-${testId}`,
            `--env-file=${dotEnvPath}`,
          ],
          env: {
            ...process.env,
            // // See: https://www.docker.com/blog/faster-builds-in-compose-thanks-to-buildkit-support/
            PORT: String(port),
            DB_PORT: String(dbPort),
            COMPOSE_DOCKER_CLI_BUILD: "1",
            DOCKER_BUILDKIT: "1",
          },
        };
        logger.debug("dockerComposeOptions", { dockerComposeDir });

        // Cleanup Docker Compose before run
        await down(dockerComposeOptions);

        logger.info("Running docker compose up...");
        await compose.upAll({
          ...dockerComposeOptions,
          commandOptions: ["--build", "--force-recreate"],
        });

        compose
          .logs([], {
            ...dockerComposeOptions,
            follow: true,
          })
          .catch((err) => {
            logger.error(err.message, err);
          });

        logger.info("Waiting for server to be ready...");
        await sleep(SERVER_START_TIMEOUT);
      });

      afterAll(async () => {
        await down(dockerComposeOptions);
      });

      it("check /api/health/live endpoint", async () => {
        const res = await fetch(`${host}/api/health/live`, {
          method: "GET",
        });
        expect(res.status === STATUS_OK);
      });

      it("check api/health/ready endpoint", async () => {
        const res = await fetch(`${host}/api/health/ready`, {
          method: "GET",
        });
        expect(res.status === STATUS_OK);
      });

      it("creates POST /api/login endpoint", async () => {
        const res = await fetch(`${host}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": JSON_MIME,
          },
          body: JSON.stringify({
            username: APP_USERNAME,
            password: APP_PASSWORD,
          }),
        });
        expect(res.status === STATUS_CREATED);
        expect(await res.json()).toEqual(
          expect.objectContaining({
            username: APP_USERNAME,
            roles: APP_DEFAULT_USER_ROLES,
          })
        );
      });

      describe("for customers entities", () => {
        describe("when using REST Api", () => {
          it("creates POST /api/customers endpoint", async () => {
            const res = await fetch(`${host}/api/customers`, {
              method: "POST",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
              body: JSON.stringify(EXAMPLE_CUSTOMER),
            });
            expect(res.status === STATUS_CREATED);
            customer = await res.json();
            expect(customer).toEqual(
              expect.objectContaining({
                ...EXAMPLE_CUSTOMER,
                id: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              })
            );
          });

          it("creates PATCH /api/customers/:id endpoint", async () => {
            const customer = await (
              await fetch(`${host}/api/customers`, {
                method: "POST",
                headers: {
                  "Content-Type": JSON_MIME,
                  Authorization: APP_BASIC_AUTHORIZATION,
                },
                body: JSON.stringify(EXAMPLE_CUSTOMER),
              })
            ).json();
            const res = await fetch(`${host}/api/customers/${customer.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
              body: JSON.stringify(EXAMPLE_CUSTOMER_UPDATE),
            });
            expect(res.status === STATUS_OK);
          });

          it("handles PATCH /api/customers/:id for a non-existing id", async () => {
            const id = "nonExistingId";
            const res = await fetch(`${host}/api/customers/${id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
              body: JSON.stringify(EXAMPLE_CUSTOMER_UPDATE),
            });
            expect(res.status === NOT_FOUND);
          });

          it("creates DELETE /api/customers/:id endpoint", async () => {
            const customer = await (
              await fetch(`${host}/api/customers`, {
                method: "POST",
                headers: {
                  "Content-Type": JSON_MIME,
                  Authorization: APP_BASIC_AUTHORIZATION,
                },
                body: JSON.stringify(EXAMPLE_CUSTOMER),
              })
            ).json();
            const res = await fetch(`${host}/api/customers/${customer.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
            });
            expect(res.status === STATUS_OK);
          });

          it("handles DELETE /api/customers/:id for a non-existing id", async () => {
            const id = "nonExistingId";
            const res = await fetch(`${host}/api/customers/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
            });
            expect(res.status === NOT_FOUND);
          });

          it("creates GET /api/customers endpoint", async () => {
            const res = await fetch(`${host}/api/customers`, {
              headers: {
                Authorization: APP_BASIC_AUTHORIZATION,
              },
            });
            expect(res.status === STATUS_OK);
            const customers = await res.json();
            expect(customers).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  ...EXAMPLE_CUSTOMER,
                  id: expect.any(String),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                }),
              ])
            );
          });

          // TODO uncomment once issue is fixed https://github.com/amplication/amplication/issues/5437
          xit("creates GET /api/customers/:id endpoint", async () => {
            const customerId = 1;
            logger.debug(`${host}/api/customers/${customerId}`);
            const res = await fetch(`${host}/api/customers/${customerId}`, {
              headers: {
                Authorization: APP_BASIC_AUTHORIZATION,
              },
            });

            expect(res.status === STATUS_OK);
            expect(await res.json()).toEqual(
              expect.objectContaining({
                ...EXAMPLE_CUSTOMER,
                id: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
              })
            );
          });
        });

        describe("when using GraphQL Api", () => {
          it("gets all customer", async () => {
            const res = await apolloClient.query({
              query: gql`
                {
                  customers(where: {}) {
                    id
                    createdAt
                    updatedAt
                    email
                    firstName
                    lastName
                  }
                }
              `,
            });

            expect(res).toEqual(
              expect.objectContaining({
                data: {
                  customers: expect.arrayContaining([
                    expect.objectContaining({
                      ...omit(EXAMPLE_CUSTOMER, ["organization"]),
                      id: customer.id,
                      createdAt: expect.any(String),
                      updatedAt: expect.any(String),
                    }),
                  ]),
                },
              })
            );
          });

          it("adds a new customer", async () => {
            try {
              const resp = await apolloClient.mutate({
                mutation: gql`
                  mutation CreateCustomer($data: CustomerCreateInput!) {
                    createCustomer(data: $data) {
                      id
                      email
                    }
                  }
                `,
                variables: {
                  data: EXAMPLE_CUSTOMER,
                },
              });
              expect(resp).toEqual(
                expect.objectContaining({
                  data: {
                    createCustomer: expect.objectContaining({
                      id: expect.any(String),
                      email: EXAMPLE_CUSTOMER.email,
                    }),
                  },
                })
              );
            } catch (error) {
              logger.error(error.message, error);
              throw error;
            }
          });
        });
      });

      describe("for organizations entities", () => {
        it("creates POST /api/organizations/:id/customers endpoint", async () => {
          const customer = await (
            await fetch(`${host}/api/customers`, {
              method: "POST",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
              body: JSON.stringify(EXAMPLE_CUSTOMER),
            })
          ).json();

          const organization = await (
            await fetch(`${host}/api/organizations`, {
              method: "POST",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
              body: JSON.stringify(EXAMPLE_ORGANIZATION),
            })
          ).json();

          const res = await fetch(
            `${host}/api/organizations/${organization.id}/customers`,
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
          const data = await res.text();
          expect(data).toBe("");
        });

        it("creates DELETE /api/organizations/:id/customers endpoint", async () => {
          const customer = await (
            await fetch(`${host}/api/customers`, {
              method: "POST",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
              body: JSON.stringify(EXAMPLE_CUSTOMER),
            })
          ).json();
          const organization = await (
            await fetch(`${host}/api/organizations`, {
              method: "POST",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
              body: JSON.stringify(EXAMPLE_ORGANIZATION),
            })
          ).json();

          await fetch(
            `${host}/api/organizations/${organization.id}/customers`,
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

          const res = await fetch(
            `${host}/api/organizations/${organization.id}/customers`,
            {
              method: "DELETE",
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
          expect(res.status).toBe(STATUS_OK);
          const data = await res.text();
          expect(data).toBe("");
        });

        it("creates GET /api/organizations/:id/customers endpoint", async () => {
          const customer = await (
            await fetch(`${host}/api/customers`, {
              method: "POST",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
              body: JSON.stringify(EXAMPLE_CUSTOMER),
            })
          ).json();
          const organization = await (
            await fetch(`${host}/api/organizations`, {
              method: "POST",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
              body: JSON.stringify(EXAMPLE_ORGANIZATION),
            })
          ).json();

          await fetch(
            `${host}/api/organizations/${organization.id}/customers`,
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

          const res = await fetch(
            `${host}/api/organizations/${organization.id}/customers`,
            {
              method: "GET",
              headers: {
                "Content-Type": JSON_MIME,
                Authorization: APP_BASIC_AUTHORIZATION,
              },
            }
          );
          expect(res.status).toBe(STATUS_OK);
          const data = await res.json();
          expect(data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                ...EXAMPLE_CUSTOMER,
                id: customer.id,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                organization: {
                  id: organization.id,
                },
              }),
            ])
          );
        });
      });

      //TODO add test if not connect to db send api/health/ready status 503
    }
  );
});

async function down(
  options: compose.IDockerComposeOptions
): Promise<compose.IDockerComposeResult> {
  return compose.down({
    ...options,
    commandOptions: NO_DELETE_IMAGE
      ? ["--volumes"]
      : ["--rmi=local", "--volumes"],
  });
}
