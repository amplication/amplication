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
import { IconType } from "../../Components/FeatureIndicatorContainer";
import "./ModelOrganizerDisabled.scss";
import { GET_CONTACT_US_LINK } from "../../Workspaces/queries/workspaceQueries";
import { AppContext } from "../../context/appContext";
import { useQuery } from "@apollo/client";

type Props = {
  icon: IconType;
};
export const CLASS_NAME = "model-organizer-disabled";

export const ModuleOrganizerDisabled: React.FC<Props> = ({ icon }) => {
  const { currentWorkspace } = useContext(AppContext);

  const { data } = useQuery(GET_CONTACT_US_LINK, {
    variables: { id: currentWorkspace.id },
  });

  return (
    <div className={CLASS_NAME}>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Center}
        className={`${CLASS_NAME}__addon-section`}
      >
        <div className={`${CLASS_NAME}__feature-tag`}>
          <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.Black}>
            Premium feature
          </Text>
          <Icon icon={icon} size={"xsmall"} color={EnumTextColor.Black} />
        </div>
        <Text
          textStyle={EnumTextStyle.H2}
          textWeight={EnumTextWeight.Bold}
          className={`${CLASS_NAME}__addon-section__title`}
        >
          Unlock your Architecture Full Potential
        </Text>
        <Text textWeight={EnumTextWeight.Regular}>
          Enhance your architectural designs with our advanced tools. Optimize
          your projects for
        </Text>
        <Text textWeight={EnumTextWeight.Regular}>
          <span>
            {" "}
            excellence and unlock the full potential of your vision.{" "}
          </span>
          <a
            className={`${CLASS_NAME}__addon-section__contact-us`}
            href={data?.contactUsLink}
            target="blank"
          >
            <Text>{"Contact us"}</Text>{" "}
          </a>
          to learn more.
        </Text>
      </FlexItem>
    </div>
  );
};
