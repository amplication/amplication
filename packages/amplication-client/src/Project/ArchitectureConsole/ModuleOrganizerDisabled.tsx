import {
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  EnumTextWeight,
  FlexItem,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import { IconType } from "../../Components/FeatureIndicatorContainer";

type Props = {
  icon: IconType;
  handleSearchChange: (value: string) => void;
  className: string;
};

export const ModuleOrganizerDisabled: React.FC<Props> = ({
  icon,
  className,
}) => {
  return (
    <FlexItem
      direction={EnumFlexDirection.Column}
      itemsAlign={EnumItemsAlign.Center}
      className={`${className}__addon-section`}
    >
      <div className={`${className}__feature-tag`}>
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.Black}>
          Premium feature
        </Text>
        <Icon icon={icon} size={"xsmall"} color={EnumTextColor.Black} />
      </div>
      <Text
        textStyle={EnumTextStyle.H2}
        textWeight={EnumTextWeight.Bold}
        className={`${className}__addon-section__title`}
      >
        Unlock your Architecture Full Potential
      </Text>
      <Text textWeight={EnumTextWeight.Regular}>
        Enhance your architectural designs with our advanced tools. Optimize
        your projects for
      </Text>
      <Text textWeight={EnumTextWeight.Regular}>
        <span> excellence and unlock the full potential of your vision. </span>
        <a
          className={`${className}__addon-section__contact-us`}
          href={"https://meetings-eu1.hubspot.com/liza-dymava/cta-link"}
          target="blank"
        >
          <Text>{"Contact us"}</Text>{" "}
        </a>
        to learn more.
      </Text>
    </FlexItem>
  );
};
