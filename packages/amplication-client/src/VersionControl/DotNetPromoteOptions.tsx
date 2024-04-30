import { useQuery } from "@apollo/client";
import "./DotNetPromoteOptions.scss";
import { GET_CONTACT_US_LINK } from "../Workspaces/queries/workspaceQueries";
import { useAppContext } from "../context/appContext";
import {
  Button,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumTextColor,
  FlexItem,
  JumboButton,
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
      <div>
        To explore our new product capabilities, including lightning-fast
        backend code generation, and gain early access, please schedule a demo
        with us.
        <br />
        Unfortunately, we encounter limited demo slots due to high demand.
        <br />
        Apologies for any inconvenience.
        <br />
        <br />
        We look forward to showcasing how Amplication can accelerate your
        startup's development journey
        <br />
        <a href={data.contactUsLink} target="blank">
          <Text textColor={EnumTextColor.ThemeTurquoise}>{"Contact us"}</Text>{" "}
        </a>
      </div>
    );
  };
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
        startupOrEnterpriseInfo()
      ) : (
        startupOrEnterpriseInfo()
      )}

      <Button onClick={() => handleBusinessTypeChange("none")}>Back</Button>
    </div>
  );
};
