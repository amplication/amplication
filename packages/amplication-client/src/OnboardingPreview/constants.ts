import * as models from "../models";
import imgAdminUI from "../assets/images/admin-ui.svg";
import imgGraphql from "../assets/images/graphql.svg";
import imgSwagger from "../assets/images/swagger.svg";
const PLUGIN_LOGO_BASE_URL =
  "https://raw.githubusercontent.com/amplication/plugin-catalog/master/assets/icons/";

type PluginInstallation = {
  pluginId: string;
  pluginSettingsOverrides?: object;
};

type SelectionItem = {
  icon: string;
  iconClassName?: string;
  defaultIcon?: "none";
  title: string;
  selected?: boolean;
  value?: any;
  plugins?: PluginInstallation[];
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
        plugins: [{ pluginId: "db-postgres" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-mongo.png`,
        title: "Mongo DB",
        plugins: [{ pluginId: "db-mongo" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-mysql.png`,
        title: "MySQL DB",
        plugins: [{ pluginId: "db-mysql" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-mssql.png`,
        title: "MS SQL Server",
        plugins: [{ pluginId: "db-mssql" }],
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
        plugins: [{ pluginId: "transport-grpc" }],
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
        plugins: [
          { pluginId: "auth-core" },
          {
            pluginId: "auth-supertokens",
            pluginSettingsOverrides: { supertokensIdFieldName: "username" },
          },
        ],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-keycloak.png`,
        title: "Keycloak",
        plugins: [{ pluginId: "auth-core" }, { pluginId: "auth-keycloak" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-auth0.png`,
        title: "Auth0",
        plugins: [{ pluginId: "auth-core" }, { pluginId: "auth-auth0" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-jwt.png`,
        title: "Local JWT Provider",
        plugins: [{ pluginId: "auth-core" }, { pluginId: "auth-jwt" }],
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
        plugins: [{ pluginId: "broker-kafka" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}broker-mqtt.png`,
        title: "MQTT",
        plugins: [{ pluginId: "broker-mqtt" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}broker-nats.png`,
        title: "NATS",
        plugins: [{ pluginId: "broker-nats" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}broker-rabbitmq.png`,
        title: "RabbitMQ",
        plugins: [{ pluginId: "broker-rabbitmq" }],
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
        plugins: [{ pluginId: "deployment-helm-chart" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}provisioning-terraform-aws-core.png`,
        title: "AWS ECS + RDS (Terraform)",
        plugins: [
          { pluginId: "provisioning-terraform-aws-core" },
          { pluginId: "provisioning-terraform-aws-database-rds" },
          { pluginId: "provisioning-terraform-aws-deployment-ecs" },
          { pluginId: "provisioning-terraform-aws-repository-ecr" },
        ],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}provisioning-terraform-gcp-core.png`,
        title: "GCP (Terraform)",
        plugins: [
          { pluginId: "provisioning-terraform-gcp-core" },
          { pluginId: "provisioning-terraform-gcp-database-csql" },
          { pluginId: "provisioning-terraform-gcp-repository-ar" },
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
        plugins: [{ pluginId: "cache-redis" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}observability-opentelemetry.png`,
        title: "Open-telemetry",
        plugins: [{ pluginId: "observability-opentelemetry" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}formatter-prettier.png`,
        title: "Prettier",
        plugins: [{ pluginId: "formatter-prettier" }],
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}linter-eslint.png`,
        title: "ESLint",
        plugins: [{ pluginId: "linter-eslint" }],
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
      codeGenerator: models.EnumCodeGenerator.NodeJs,
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
