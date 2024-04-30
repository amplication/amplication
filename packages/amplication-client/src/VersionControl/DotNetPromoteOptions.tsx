import { useQuery } from "@apollo/client";
import "./DotNetPromoteOptions.scss";
import { GET_CONTACT_US_LINK } from "../Workspaces/queries/workspaceQueries";
import { useAppContext } from "../context/appContext";
import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  JumboButton,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";

const CLASS_NAME = "dotnet-promote-options";

export const DotNetPromoteOptions = () => {
  const { currentWorkspace } = useAppContext();
  const [businessType, setBusinessType] = useState<
    "personal" | "startup" | "enterprise" | "none"
  >("none");

  const handleBusinessTypeChange = useCallback((type) => {
    setBusinessType(type);
  }, []);

  const { data } = useQuery(GET_CONTACT_US_LINK, {
    variables: { id: currentWorkspace?.id },
  });

  const startupOrEnterpriseInfo = () => {
    return (
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Center}
        gap={EnumGapSize.Large}
      >
        <Text textStyle={EnumTextStyle.Normal} textAlign={EnumTextAlign.Center}>
          To explore our new product capabilities, including lightning-fast
          backend code generation, and gain early access, please schedule a demo
          with us.
        </Text>
        <Text
          textStyle={EnumTextStyle.Normal}
          textColor={EnumTextColor.White}
          textAlign={EnumTextAlign.Center}
        >
          We look forward to showcasing how Amplication can accelerate your
          startup's development journey
        </Text>

        <a href={data.contactUsLink} target="blank">
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            className={`${CLASS_NAME}__demo`}
          >
            <Icon icon="calendar" size="small" />
            {"Schedule a demo"}
          </Button>
        </a>
        <Panel panelStyle={EnumPanelStyle.Bordered}>
          <Text
            textStyle={EnumTextStyle.Description}
            textColor={EnumTextColor.ThemeOrange}
          >
            Unfortunately, we encounter limited demo slots due to high demand.
            Apologies for any inconvenience.
          </Text>
        </Panel>
      </FlexItem>
    );
  };
  return (
    <div className={CLASS_NAME}>
      {businessType === "none" ? (
        <>
          <Text
            textStyle={EnumTextStyle.H3}
            textColor={EnumTextColor.White}
            className={`${CLASS_NAME}__cta`}
            textAlign={EnumTextAlign.Center}
          >
            Could you please let us know your preferred usage scenario?
          </Text>
          <FlexItem gap={EnumGapSize.Large} margin={EnumFlexItemMargin.Bottom}>
            <JumboButton
              text="Personal"
              icon="user"
              onClick={() => {
                handleBusinessTypeChange("personal");
              }}
              circleColor={EnumTextColor.ThemeBlue}
            ></JumboButton>

            <JumboButton
              text="Startup"
              icon="publish"
              onClick={() => {
                handleBusinessTypeChange("startup");
              }}
              circleColor={EnumTextColor.ThemeGreen}
            ></JumboButton>
            <JumboButton
              text="Enterprise"
              icon="globe"
              onClick={() => {
                handleBusinessTypeChange("enterprise");
              }}
              circleColor={EnumTextColor.ThemeOrange}
            ></JumboButton>
          </FlexItem>
        </>
      ) : (
        <>
          <Panel panelStyle={EnumPanelStyle.Bold}>
            <FlexItem
              direction={EnumFlexDirection.Column}
              itemsAlign={EnumItemsAlign.Center}
              gap={EnumGapSize.None}
            ></FlexItem>
            {businessType === "personal" ? (
              <div>
                <Text
                  textStyle={EnumTextStyle.H3}
                  textAlign={EnumTextAlign.Center}
                  className={`${CLASS_NAME}__type-title`}
                >
                  Amplication .NET for Personal Projects
                </Text>

                <Text
                  textStyle={EnumTextStyle.Normal}
                  textAlign={EnumTextAlign.Center}
                >
                  <p>
                    We're currently hard at work on a free version tailored for
                    personal projects, slated for release very soon.
                  </p>
                  <p>
                    Stay tuned for updates, and thank you for your patience!
                  </p>
                  <p>
                    In the meantime, we'd love to hear your thoughts and
                    feedback. Feel free to reach out to us at our discord
                    community.
                  </p>
                  <p>
                    <a href={data.contactUsLink} target="blank">
                      <Text textColor={EnumTextColor.ThemeTurquoise}>
                        https://amplication.com/discord
                      </Text>
                    </a>
                  </p>
                </Text>
              </div>
            ) : businessType === "startup" ? (
              <>
                <Text
                  textStyle={EnumTextStyle.H3}
                  textAlign={EnumTextAlign.Center}
                  className={`${CLASS_NAME}__type-title`}
                >
                  Amplication .NET for Startup
                </Text>
                {startupOrEnterpriseInfo()}
              </>
            ) : (
              <>
                <Text
                  textStyle={EnumTextStyle.H3}
                  textAlign={EnumTextAlign.Center}
                  className={`${CLASS_NAME}__type-title`}
                >
                  Amplication .NET for Enterprise
                </Text>
                {startupOrEnterpriseInfo()}
              </>
            )}
          </Panel>
        </>
      )}
    </div>
  );
};
