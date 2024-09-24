import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextAlign,
  EnumTextStyle,
  FlexItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTracking } from "../util/analytics";
import { AnalyticsEventNames } from "../util/analytics-events.types";
import { expireCookie } from "../util/cookie";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import AssistantChatInput from "./AssistantChatInput";
import JovuLogo, { EnumLogoSize } from "./JovuLogo";
import "./OnboardingWithJovu.scss";
import { useAssistantContext } from "./context/AssistantContext";

const CLASS_NAME = "onboarding-with-jovu";

const STARTERS = [
  "Create a blog application that utilizes event-driven architecture. Include two services, one with GraphQL API and Postgres, writing to Kafka, and another reading from Kafka and writing to MongoBD.",
  "Build a CRM system for a real estate agency. This CRM needs to manage properties, clients, appointments, and agent assignments.",
  "Create a service for a twitter clone, based on PostgreSQL with REST and GraphQL APIs. Generate the production-ready code also for all the required APIs.",
  "Add a service of product reviews to my e-commerce system. The service should have a Redis cache layer, and authentication method so users can edit their reviews only.",
];

const OnboardingWithJovu: React.FC = () => {
  const { trackEvent } = useTracking();

  const { setOpen, sendOnboardingMessage } = useAssistantContext();
  const { baseUrl } = useProjectBaseUrl();

  const history = useHistory();

  const handleSubmit = useCallback(
    (message: string) => {
      sendOnboardingMessage(message);
      expireCookie("signup");
      setOpen(true);
      trackEvent({
        eventName: AnalyticsEventNames.SendPromptOnboardingWithJovu,
      });
      history.push(`${baseUrl}`);
    },
    [baseUrl, history, sendOnboardingMessage, setOpen, trackEvent]
  );

  useEffect(() => {
    trackEvent({
      eventName: AnalyticsEventNames.ViewOnboardingWithJovu,
    });
  }, []);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__body`}>
        <div className={`${CLASS_NAME}__content`}>
          <FlexItem
            direction={EnumFlexDirection.Column}
            itemsAlign={EnumItemsAlign.Center}
            contentAlign={EnumContentAlign.Center}
          >
            <JovuLogo
              size={EnumLogoSize.ExtraLArge}
              loading
              useCircularProgress={false}
            />
            <Text textStyle={EnumTextStyle.H1}>
              Tell us what you want to build
            </Text>
            <Text
              textStyle={EnumTextStyle.Normal}
              textAlign={EnumTextAlign.Center}
            >
              Jovu is here to help you get started building production-ready
              services
            </Text>
          </FlexItem>
        </div>
        <div className={`${CLASS_NAME}__starters`}>
          <Panel
            panelStyle={EnumPanelStyle.Bordered}
            clickable
            onClick={() => handleSubmit(STARTERS[0])}
          >
            {STARTERS[0]}
          </Panel>
          <Panel
            panelStyle={EnumPanelStyle.Bordered}
            clickable
            onClick={() => handleSubmit(STARTERS[1])}
          >
            {STARTERS[1]}
          </Panel>
          <Panel
            panelStyle={EnumPanelStyle.Bordered}
            clickable
            onClick={() => handleSubmit(STARTERS[2])}
          >
            {STARTERS[2]}
          </Panel>
          <Panel
            panelStyle={EnumPanelStyle.Bordered}
            clickable
            onClick={() => handleSubmit(STARTERS[3])}
          >
            {STARTERS[3]}
          </Panel>
        </div>
        <div className={`${CLASS_NAME}__footer`}>
          <AssistantChatInput
            sendMessage={handleSubmit}
            disabled={false}
            placeholder="I want to build an API for..."
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingWithJovu;
