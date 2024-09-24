import React from "react";
import {
  EnumFlexDirection,
  EnumGapSize,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";

const PlatformBetaContent: React.FC = () => {
  return (
    <>
      <FlexItem direction={EnumFlexDirection.Column} gap={EnumGapSize.Small}>
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
          The Platform console features, including the usage of templates and
          creation of services based on templates are currently in beta.
        </Text>
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
          For more details, check our "Platform Console"{" "}
          <a
            href="https://docs.amplication.com/docs/platform-console"
            target="_blank"
            rel="noreferrer"
          >
            <Text
              textStyle={EnumTextStyle.Tag}
              textColor={EnumTextColor.ThemeTurquoise}
              underline
            >
              documentation
            </Text>
          </a>
        </Text>
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
          If you encounter issues or have feedback, please join the discussion
          on{" "}
          <a
            href="https://github.com/amplication/amplication/discussions/8979"
            target="_blank"
            rel="noreferrer"
          >
            <Text
              textStyle={EnumTextStyle.Tag}
              textColor={EnumTextColor.ThemeTurquoise}
              underline
            >
              our GitHub repository
            </Text>
          </a>
        </Text>
      </FlexItem>
    </>
  );
};

export default PlatformBetaContent;
