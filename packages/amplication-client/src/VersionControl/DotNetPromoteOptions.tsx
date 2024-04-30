import "./DotNetPromoteOptions.scss";
import {
  Button,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumTextColor,
  FlexItem,
  JumboButton,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
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
        <FlexItem gap={EnumGapSize.Large} margin={EnumFlexItemMargin.Bottom}>
          <JumboButton
            text="Personal"
            icon="pending_changes"
            onClick={() => {
              handleBusinessTypeChange("personal");
            }}
            circleColor={EnumTextColor.ThemeTurquoise}
          ></JumboButton>

          <JumboButton
            text="Startup"
            icon="pending_changes"
            onClick={() => {
              handleBusinessTypeChange("startup");
            }}
            circleColor={EnumTextColor.ThemeTurquoise}
          ></JumboButton>
          <JumboButton
            text="Enterprise"
            icon="pending_changes"
            onClick={() => {
              handleBusinessTypeChange("enterprise");
            }}
            circleColor={EnumTextColor.ThemeTurquoise}
          ></JumboButton>
        </FlexItem>
      ) : businessType === "personal" ? (
        <div>
          We're currently hard at work on a free version tailored for personal
          projects, slated for release very soon.
          <br />
          Stay tuned for updates, and thank you for your patience!
        </div>
      ) : businessType === "startup" ? (
        <DotNetPromoteStartupOrEnterpriseIOption
          contactLink={contactStartupLink}
        />
      ) : (
        <DotNetPromoteStartupOrEnterpriseIOption
          contactLink={contactEnterpriseLink}
        />
      )}

      <Button onClick={() => handleBusinessTypeChange("none")}>Back</Button>
    </div>
  );
};
