import {
  EnumFlexDirection,
  EnumGapSize,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Popover,
  Text,
} from "@amplication/ui/design-system";
import "./BetaFeatureTag.scss";

const TOOLTIP_DIRECTION = "bottom-end";

type Props = {
  tagLabel?: string;
};
const CLASS_NAME = "beta-feature-tag";

function BetaFeatureTag({ tagLabel }: Props) {
  return (
    <Popover
      className="main-layout__menu__popover"
      content={
        <div className={`${CLASS_NAME}__tooltip-content`}>
          <FlexItem
            direction={EnumFlexDirection.Column}
            gap={EnumGapSize.Small}
          >
            <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
              The Architecture tab's overview and redesign features are
              currently in beta.
            </Text>
            <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
              For more details, check our "Break the Monolith"{" "}
              <a
                href="https://docs.amplication.com/docs/break-the-monolith"
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
              If you encounter issues or have feedback, please join the
              discussion on{" "}
              <a
                href="https://github.com/amplication/amplication/discussions/7869"
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
        </div>
      }
      placement={TOOLTIP_DIRECTION}
    >
      <div className={`${CLASS_NAME}__tag`}>
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.Black}>
          {tagLabel || "Beta Feature"}
        </Text>
        <Icon icon="icon-publish" />
      </div>
    </Popover>
  );
}

export default BetaFeatureTag;
