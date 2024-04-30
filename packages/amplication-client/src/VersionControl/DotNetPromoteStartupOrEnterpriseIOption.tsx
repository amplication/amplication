import "./DotNetPromoteOptions.scss";
import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Panel,
  Text,
} from "@amplication/ui/design-system";

type Props = {
  contactLink: string;
};

const CLASS_NAME = "dotnet-promote-options";

export const DotNetPromoteStartupOrEnterpriseIOption = ({
  contactLink,
}: Props) => {
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

      <a href={contactLink} target="blank">
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
