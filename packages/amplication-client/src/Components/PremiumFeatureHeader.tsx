import {
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  EnumTextWeight,
  FlexItem,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import { useContactUs } from "../Workspaces/hooks/useContactUs";
import "./FeatureIndicator.scss";
import { IconType } from "./FeatureIndicatorContainer";
import "./PremiumFeatureHeader.scss";

const CLASS_NAME = "premium-feature-header";

type Props = {
  title: string;
  message: string;
};

export const PremiumFeatureHeader = ({ title, message }: Props) => {
  const { contactUsLink } = useContactUs({});

  return (
    <div className={CLASS_NAME}>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Center}
        className={`${CLASS_NAME}__content`}
      >
        <div className={`${CLASS_NAME}__feature-tag`}>
          <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.Black}>
            Premium feature
          </Text>
          <Icon
            icon={IconType.Diamond}
            size={"xsmall"}
            color={EnumTextColor.Black}
          />
        </div>
        <Text
          textStyle={EnumTextStyle.H2}
          textWeight={EnumTextWeight.Bold}
          className={`${CLASS_NAME}__addon-section__title`}
          textAlign={EnumTextAlign.Center}
        >
          {title}
        </Text>
        <Text
          textWeight={EnumTextWeight.Regular}
          textAlign={EnumTextAlign.Center}
        >
          {message}
        </Text>
        <Text
          textWeight={EnumTextWeight.Regular}
          textColor={EnumTextColor.Black20}
          textAlign={EnumTextAlign.Center}
        >
          {contactUsLink && (
            <a href={contactUsLink} target="blank">
              <Text textColor={EnumTextColor.ThemeTurquoise}>
                {"Contact us"}
              </Text>{" "}
            </a>
          )}
          for more information.
        </Text>
      </FlexItem>
    </div>
  );
};
