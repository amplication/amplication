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
import React, { useContext } from "react";
import { IconType } from "../Components/FeatureIndicatorContainer";
import { AppContext } from "../context/appContext";
import { useQuery } from "@apollo/client";
import { GET_CONTACT_US_LINK } from "../Workspaces/queries/workspaceQueries";

type Props = {
  className: string;
};

export const ModuleActionsDisabled: React.FC<Props> = ({ className }) => {
  const { currentWorkspace } = useContext(AppContext);

  const { data } = useQuery(GET_CONTACT_US_LINK, {
    variables: { id: currentWorkspace.id },
  });

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
        <Icon
          icon={IconType.Diamond}
          size={"xsmall"}
          color={EnumTextColor.Black}
        />
      </div>
      <Text
        textStyle={EnumTextStyle.H2}
        textWeight={EnumTextWeight.Bold}
        className={`${className}__addon-section__title`}
      >
        Unlock your APIs Full Potential
      </Text>
      <Text
        textWeight={EnumTextWeight.Regular}
        textColor={EnumTextColor.Black20}
      >
        Maximize the power of your APIs and Types through seamless management
      </Text>
      <Text
        textWeight={EnumTextWeight.Regular}
        textColor={EnumTextColor.Black20}
      >
        and customization as a unified source of truth.{" "}
        {data && (
          <a
            className={`${className}__addon-section__contact-us`}
            href={data.contactUsLink}
            target="blank"
          >
            <Text>{"Contact us"}</Text>{" "}
          </a>
        )}
        for more information
      </Text>
    </FlexItem>
  );
};
