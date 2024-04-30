import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  JumboButton,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import "./DotNetPromoteOptions.scss";
import { DotNetPromoteStartupOrEnterpriseIOption } from "./DotNetPromoteStartupOrEnterpriseIOption";

const CLASS_NAME = "dotnet-promote-options";
const contactStartupLink =
  "https://meetings-eu1.hubspot.com/muly/dotnet-overview-with-vp-engineering";
const contactEnterpriseLink =
  "https://meetings-eu1.hubspot.com/muly/dotnet-demo-with-vp-engineering";

export const DotNetPromoteOptions = () => {
  const [businessType, setBusinessType] = useState<
    "personal" | "startup" | "enterprise" | "none"
  >("none");

  const handleBusinessTypeChange = useCallback((type) => {
    setBusinessType(type);
  }, []);

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
                    <a href={"https://amplication.com/discord"} target="blank">
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
                <DotNetPromoteStartupOrEnterpriseIOption
                  contactLink={contactStartupLink}
                />
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
                <DotNetPromoteStartupOrEnterpriseIOption
                  contactLink={contactEnterpriseLink}
                />
              </>
            )}
          </Panel>
        </>
      )}
    </div>
  );
};
