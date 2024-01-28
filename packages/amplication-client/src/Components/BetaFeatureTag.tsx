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
              The architecture tab and models redesign tools are under beta.
            </Text>
            <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
              You can ream more about this feature on{" "}
              <a href="https://docs.amplication.com/docs/beta-features">
                <Text
                  textStyle={EnumTextStyle.Tag}
                  textColor={EnumTextColor.ThemeTurquoise}
                  underline
                >
                  our docs.
                </Text>
              </a>
            </Text>
            <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
              To report an issue, go to our{" "}
              <a href="https://docs.amplication.com/docs/beta-features">
                <Text
                  textStyle={EnumTextStyle.Tag}
                  textColor={EnumTextColor.ThemeTurquoise}
                  underline
                >
                  GitHub repo.
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
        <Icon icon="taget" />
      </div>
    </Popover>
  );
}

export default BetaFeatureTag;
