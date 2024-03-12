import * as models from "../models";
import imgAdminUI from "../assets/images/admin-ui.svg";
import imgGraphql from "../assets/images/graphql.svg";
import imgSwagger from "../assets/images/swagger.svg";
const PLUGIN_LOGO_BASE_URL =
  "https://raw.githubusercontent.com/amplication/plugin-catalog/master/assets/icons/";

type SelectionItem = {
  icon: string;
  iconClassName?: string;
  defaultIcon?: "none";
  title: string;
  selected?: boolean;
  value?: any;
  pluginsIds?: string[];
};

type Page = {
  title: string;
  subTitle: string;
  allowMultipleSelection: boolean;
  selectionRequired: boolean;
  items: SelectionItem[];
};

type Pages = {
  [key: string]: Page;
};

export const CONFIRMATION_PAGE: Page = {
  title: "Done!",
  subTitle: "",
  allowMultipleSelection: false,
  selectionRequired: false,
  items: [],
};

export const PAGE_KEYS = [
  "database",
  "apis",
  "adminUi",
  "authentication",
  "eventDriven",
  "deployment",
  "more",
];

export const PAGES_DATA: Pages = {
  database: {
    title: "Database",
    subTitle: "Select the type of database for your service",
    allowMultipleSelection: false,
    selectionRequired: true,
    items: [
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-postgres.png`,
        title: "PostgreSQL DB",
        pluginsIds: ["db-postgres"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-mongo.png`,
        title: "Mongo DB",
        pluginsIds: ["db-mongo"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-mysql.png`,
        title: "MySQL DB",
        pluginsIds: ["db-mysql"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-mssql.png`,
        title: "MS SQL Server",
        pluginsIds: ["db-mssql"],
      },
    ],
  },
  apis: {
    title: "APIs",
    subTitle: "Select the type of APIs for your service",
    allowMultipleSelection: true,
    selectionRequired: true,
    items: [
      {
        icon: imgSwagger,
        iconClassName: "with-padding",
        title: "REST API",
        value: {
          resource: {
            serviceSettings: {
              serverSettings: {
                generateRestApi: true,
              },
            },
          },
        },
      },
      {
        icon: imgGraphql,
        iconClassName: "with-padding",
        title: "GraphQL",
        value: {
          resource: {
            serviceSettings: {
              serverSettings: {
                generateGraphQL: true,
              },
            },
          },
        },
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}transport-grpc.png`,
        title: "gRpc",
        pluginsIds: ["transport-grpc"],
      },
    ],
  },
  adminUi: {
    title: "Admin UI",
    subTitle: "Select the client application to use your APIs",
    allowMultipleSelection: false,
    selectionRequired: true,
    items: [
      {
        icon: imgAdminUI,
        iconClassName: "with-padding",
        title: "React Admin UI",
        value: {
          resource: {
            serviceSettings: {
              adminUISettings: {
                generateAdminUI: true,
              },
            },
          },
        },
      },
      {
        icon: imgGraphql,
        iconClassName: "with-padding",
        title: "Generate APIs only",
        value: {
          resource: {
            serviceSettings: {
              adminUISettings: {
                generateAdminUI: false,
              },
            },
          },
        },
      },
    ],
  },
  authentication: {
    title: "Authentication",
    subTitle:
      "Select the type of authentication you want to use for your service",
    allowMultipleSelection: false,
    selectionRequired: true,
    items: [
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-supertokens.png`,
        title: "Supertokens",
        pluginsIds: ["auth-core", "auth-supertokens"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-keycloak.png`,
        title: "Keycloak",
        pluginsIds: ["auth-core", "auth-keycloak"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-auth0.png`,
        title: "Auth0",
        pluginsIds: ["auth-core", "auth-auth0"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-jwt.png`,
        title: "Local JWT Provider",
        pluginsIds: ["auth-core", "auth-jwt"],
      },
      {
        icon: "",
        defaultIcon: "none",
        title: "None",
      },
    ],
  },
  eventDriven: {
    title: "Event-Driven",
    subTitle:
      "Select the type of message broker to create an event-driven architecture",
    allowMultipleSelection: false,
    selectionRequired: true,
    items: [
      {
        icon: `${PLUGIN_LOGO_BASE_URL}kafka.png`,
        title: "Kafka",
        pluginsIds: ["broker-kafka"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}broker-mqtt.png`,
        title: "MQTT",
        pluginsIds: ["broker-mqtt"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}broker-nats.png`,
        title: "NATS",
        pluginsIds: ["broker-nats"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}broker-rabbitmq.png`,
        title: "RabbitMQ",
        pluginsIds: ["broker-rabbitmq"],
      },
      {
        icon: "",
        defaultIcon: "none",
        title: "None",
      },
    ],
  },
  deployment: {
    title: "Deployment",
    subTitle: "Select the deployment type for your service",
    allowMultipleSelection: false,
    selectionRequired: true,
    items: [
      {
        icon: `${PLUGIN_LOGO_BASE_URL}deployment-helm-chart.png`,
        title: "Helm Chart",
        pluginsIds: ["deployment-helm-chart"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}provisioning-terraform-aws-core.png`,
        title: "AWS ECS + RDS (Tarraform)",
        pluginsIds: [
          "provisioning-terraform-aws-core",
          "provisioning-terraform-aws-database-rds",
          "provisioning-terraform-aws-deployment-ecs",
          "provisioning-terraform-aws-repository-ecr",
        ],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}provisioning-terraform-gcp-core.png`,
        title: "GCP xxx (Tarraform)",
        pluginsIds: [
          "provisioning-terraform-gcp-core",
          "provisioning-terraform-gcp-database-csql",
          "provisioning-terraform-gcp-repository-ar",
        ],
      },
      {
        icon: "",
        defaultIcon: "none",
        title: "None",
      },
    ],
  },
  more: {
    title: "More",
    subTitle: "Select additional functionality to include in your service",
    allowMultipleSelection: true,
    selectionRequired: false,
    items: [
      {
        icon: `${PLUGIN_LOGO_BASE_URL}cache-redis.png`,
        title: "Redis Cache",
        pluginsIds: ["cache-redis"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}observability-opentelemetry.png`,
        title: "Open-telemetry",
        pluginsIds: ["observability-opentelemetry"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}formatter-prettier.png`,
        title: "Prettier",
        pluginsIds: ["formatter-prettier"],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}linter-eslint.png`,
        title: "ESLint",
        pluginsIds: ["linter-eslint"],
      },
    ],
  },
};

export const CREATE_SERVICE_DEFAULT_VALUES: models.ResourceCreateWithEntitiesInput =
  {
    resource: {
      name: "my service",
      description: "",
      resourceType: models.EnumResourceType.Service,
      project: { connect: { id: "" } },
      serviceSettings: {
        adminUISettings: {
          generateAdminUI: false,
          adminUIPath: "./apps/admin",
        },
        serverSettings: {
          generateGraphQL: false,
          generateRestApi: false,
          serverPath: "./apps/api",
        },
        authProvider: models.EnumAuthProviderType.Jwt,
      },
      gitRepository: null,
    },
    commitMessage: "",
    entities: [],
    plugins: {
      plugins: [],
    },
    wizardType: "onboarding",
    repoType: "Mono",
    dbType: "postgres",
    authType: "core",
    connectToDemoRepo: true,
  };
