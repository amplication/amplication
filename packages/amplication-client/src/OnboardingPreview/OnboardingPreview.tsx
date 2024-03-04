import {
  Button,
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback, useMemo, useState } from "react";
import "./OnboardingPreview.scss";
// import useOnboardingPreview from "./hooks/useOnboardingPreview";
import imgAdminUI from "../assets/images/admin-ui.svg";
import imgGraphql from "../assets/images/graphql.svg";
import imgSwagger from "../assets/images/swagger.svg";
import { ReactComponent as LogoTextual } from "../assets/logo-amplication-white.svg";

const PLUGIN_LOGO_BASE_URL =
  "https://raw.githubusercontent.com/amplication/plugin-catalog/master/assets/icons/";

type Props = {
  workspaceId: string;
  projectId: string;
};

type SelectionItem = {
  icon: string;
  title: string;
  selected?: boolean;
};

type Page = {
  title: string;
  subTitle: string;
  allowMultipleSelection: boolean;
  items: SelectionItem[];
};

type Pages = {
  [key: string]: Page;
};

const DATA: Pages = {
  database: {
    title: "Database",
    subTitle: "Select the type of DB for your service",
    allowMultipleSelection: false,
    items: [
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-postgres.png`,
        title: "PostgreSQL DB",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-mongo.png`,
        title: "Mongo DB",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-mysql.png`,
        title: "MySQL DB",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}db-mssql.png`,
        title: "MS SQL Server",
      },
    ],
  },
  apis: {
    title: "APIs",
    subTitle: "Select the type of APIs for your service",
    allowMultipleSelection: true,
    items: [
      {
        icon: imgSwagger,
        title: "REST API",
      },
      {
        icon: imgGraphql,
        title: "GraphQL",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}transport-grpc.png`,
        title: "gRpc",
      },
    ],
  },
  adminUi: {
    title: "Admin UI",
    subTitle:
      "Would you like to generate a React client application with forms to use your API?",
    allowMultipleSelection: false,
    items: [
      {
        icon: imgAdminUI,
        title: "Generate React Admin UI",
      },
      {
        icon: imgGraphql,
        title: "Generate APIs only",
      },
    ],
  },
  authentication: {
    title: "Authentication",
    subTitle:
      "Select the type of authentication you want to use for your service",
    allowMultipleSelection: false,
    items: [
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-supertokens.png`,
        title: "Supertokens",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-keycloak.png`,
        title: "Keycloak",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-auth0.png`,
        title: "Auth0",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-jwt.png`,
        title: "Local JWT Provider",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-basic.png`,
        title: "None",
      },
    ],
  },
  eventDriven: {
    title: "Event-Driven",
    subTitle:
      "Would you like to use a message broker to create an event driven architecture",
    allowMultipleSelection: false,
    items: [
      {
        icon: `${PLUGIN_LOGO_BASE_URL}kafka.png`,
        title: "Kafka",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}broker-mqtt.png`,
        title: "MQTT",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}broker-nats.png`,
        title: "NATS",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}broker-rabbitmq.png`,
        title: "RabbitMQ",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-basic.png`,
        title: "None",
      },
    ],
  },
  deployment: {
    title: "Deployment",
    subTitle: "How would you like to deploy your service?",
    allowMultipleSelection: false,
    items: [
      {
        icon: `${PLUGIN_LOGO_BASE_URL}deployment-helm-chart.png`,
        title: "Helm Chart",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}provisioning-terraform-aws-core.png`,
        title: "AWS ECS + RDS (Tarraform)",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}provisioning-terraform-gcp-core.png`,
        title: "GCP xxx (Tarraform)",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}auth-basic.png`,
        title: "None",
      },
    ],
  },
  more: {
    title: "More",
    subTitle: "What else do you want to include in your service?",
    allowMultipleSelection: true,
    items: [
      {
        icon: `${PLUGIN_LOGO_BASE_URL}formatter-prettier.png`,
        title: "Prettier",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}linter-eslint.png`,
        title: "ESLint",
      },
      {
        icon: `${PLUGIN_LOGO_BASE_URL}observability-opentelemetry.png`,
        title: "Open-telemetry",
      },
    ],
  },
};

const confirmationPage: Page = {
  title: "Done!",
  subTitle: "",
  allowMultipleSelection: false,
  items: [],
};

const pageKeys = [
  "database",
  "apis",
  "adminUi",
  "authentication",
  "eventDriven",
  "deployment",
  "more",
];

const CLASS_NAME = "onboarding-preview";

const OnboardingPreview: React.FC<Props> = ({ workspaceId, projectId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pagesData, setPagesData] = useState(DATA);
  const [done, setDone] = useState(false);

  const handleContinueClick = useCallback(() => {
    if (currentPage < pageKeys.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setDone(true);
    }
  }, [currentPage]);

  const handleBackClick = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleItemClick = useCallback(
    (item: SelectionItem, itemIndex: number) => {
      const currentPageKey = pageKeys[currentPage];
      const newPagesData = { ...pagesData };
      const newItems = [...newPagesData[currentPageKey].items];
      const currentItem = newItems[itemIndex];

      if (!newPagesData[currentPageKey].allowMultipleSelection) {
        newItems.forEach((i, index) => {
          i.selected = false;
        });
        newItems[itemIndex].selected = true;
      } else {
        newItems[itemIndex].selected = !newItems[itemIndex].selected;
      }
      newPagesData[currentPageKey] = {
        ...newPagesData[currentPageKey],
        items: newItems,
      };
      setPagesData(newPagesData);
      if (!newPagesData[currentPageKey].allowMultipleSelection) {
        handleContinueClick();
      } else {
        if (!newItems.some((item) => !item.selected)) {
          handleContinueClick();
        }
      }
    },
    [currentPage, handleContinueClick, pagesData]
  );

  const canContinue = useMemo(() => {
    const currentPageKey = pageKeys[currentPage];
    const currentPageData = pagesData[currentPageKey];
    const selectedItems = currentPageData.items.filter((item) => item.selected);
    return selectedItems.length > 0;
  }, [currentPage, pagesData]);

  const canGoBack = currentPage > 0;

  // const { createService, errorCreateService, loadingCreateService } =
  //   useOnboardingPreview();

  const currentPageKey = pageKeys[currentPage];
  const currentPageData = done ? confirmationPage : pagesData[currentPageKey];

  return (
    <FlexItem
      direction={EnumFlexDirection.Column}
      itemsAlign={EnumItemsAlign.Stretch}
      contentAlign={EnumContentAlign.Start}
    >
      <FlexItem.FlexStart
        alignSelf={EnumContentAlign.Center}
        className={`${CLASS_NAME}__header`}
      >
        <LogoTextual className={`${CLASS_NAME}__header__logo`} />
      </FlexItem.FlexStart>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Center}
        contentAlign={EnumContentAlign.Start}
        start={
          <FlexItem
            direction={EnumFlexDirection.Column}
            itemsAlign={EnumItemsAlign.Center}
            margin={EnumFlexItemMargin.Both}
          >
            <Text textStyle={EnumTextStyle.H1} textAlign={EnumTextAlign.Center}>
              {currentPageData.title}
            </Text>
            <Text
              textStyle={EnumTextStyle.Description}
              textAlign={EnumTextAlign.Center}
            >
              {currentPageData.subTitle}
            </Text>
            {currentPageData.allowMultipleSelection && (
              <Text
                textStyle={EnumTextStyle.Description}
                textColor={EnumTextColor.ThemeTurquoise}
                textAlign={EnumTextAlign.Center}
              >
                Select one or more and click Continue
              </Text>
            )}
          </FlexItem>
        }
        className={`${CLASS_NAME}__body`}
      >
        {done ? (
          <FlexItem
            direction={EnumFlexDirection.Column}
            itemsAlign={EnumItemsAlign.Center}
            margin={EnumFlexItemMargin.Both}
          >
            <Text textStyle={EnumTextStyle.H3} textAlign={EnumTextAlign.Center}>
              We are generating your service.
            </Text>
            <Text
              textStyle={EnumTextStyle.Description}
              textAlign={EnumTextAlign.Center}
            >
              You will get an email with a link to a GitHub repo with the
              generated code of your service.
            </Text>
            <span
              role="img"
              aria-label="party emoji"
              className={`${CLASS_NAME}__party`}
            >
              🎉
            </span>
          </FlexItem>
        ) : (
          currentPageData.items.map((item, index) => (
            <Button
              key={`${currentPage}${item.title}`}
              buttonStyle={
                item.selected
                  ? EnumButtonStyle.Primary
                  : EnumButtonStyle.Outline
              }
              onClick={() => {
                handleItemClick(item, index);
              }}
            >
              <img src={item.icon} alt={item.title} />
              <Text textStyle={EnumTextStyle.H3}>{item.title}</Text>
            </Button>
          ))
        )}
      </FlexItem>

      <FlexItem.FlexEnd className={`${CLASS_NAME}__footer`}>
        {!done && (
          <FlexItem>
            <FlexItem.FlexStart>
              {canGoBack && (
                <Button
                  buttonStyle={EnumButtonStyle.Outline}
                  onClick={handleBackClick}
                  disabled={!canGoBack}
                >
                  Back
                </Button>
              )}
            </FlexItem.FlexStart>
            <FlexItem.FlexEnd>
              <Button
                buttonStyle={EnumButtonStyle.Primary}
                onClick={handleContinueClick}
                disabled={!canContinue}
              >
                {currentPage === pageKeys.length - 1 ? "Done" : "Continue"}
              </Button>
            </FlexItem.FlexEnd>
          </FlexItem>
        )}
      </FlexItem.FlexEnd>
    </FlexItem>
  );
};

export default OnboardingPreview;
