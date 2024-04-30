import { useQuery } from "@apollo/client";
import { DotNetPromoteOption } from "./DotNetPromoteOption";
import "./DotNetPromoteOptions.scss";
import { GET_CONTACT_US_LINK } from "../Workspaces/queries/workspaceQueries";
import { useAppContext } from "../context/appContext";
import { EnumTextColor, Text } from "@amplication/ui/design-system";

const CLASS_NAME = "dotnet-promote-options";

export const DotNetPromoteOptions = () => {
  const { currentWorkspace } = useAppContext();

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
      <div className={`${CLASS_NAME}__list`}>
        <DotNetPromoteOption
          option="Personal Use"
          type="personal"
          answer={
            <div>
              We're currently hard at work on a free version tailored for
              personal projects, slated for release very soon.
              <br />
              Stay tuned for updates, and thank you for your patience!
            </div>
          }
        />
        <DotNetPromoteOption
          option="startup"
          type="Startup"
          answer={startupOrEnterpriseInfo()}
        />
        <DotNetPromoteOption
          type="enterprise"
          option="Enterprise"
          answer={startupOrEnterpriseInfo()}
        />
      </div>
    </div>
  );
};
