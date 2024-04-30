import "./DotNetPromoteOptions.scss";
import { EnumTextColor, Text } from "@amplication/ui/design-system";

type Props = {
  contactLink: string;
};

export const DotNetPromoteStartupOrEnterpriseIOption = ({
  contactLink,
}: Props) => {
  return (
    <div>
      To explore our new product capabilities, including lightning-fast backend
      code generation, and gain early access, please schedule a demo with us.
      <br />
      Unfortunately, we encounter limited demo slots due to high demand.
      <br />
      Apologies for any inconvenience.
      <br />
      <br />
      We look forward to showcasing how Amplication can accelerate your
      startup's development journey
      <br />
      <a href={contactLink} target="blank">
        <Text textColor={EnumTextColor.ThemeTurquoise}>{"Contact us"}</Text>{" "}
      </a>
    </div>
  );
};
