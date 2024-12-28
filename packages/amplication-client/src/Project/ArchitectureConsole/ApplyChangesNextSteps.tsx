import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  JumboButton,
  Text,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { CommitBtnType } from "../../VersionControl/Commit";
import CommitButton from "../../VersionControl/CommitButton";
import { EnumCommitStrategy, EnumResourceTypeGroup } from "../../models";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";
import "./ApplyChangesNextSteps.scss";

const className = "apply-changes-next-steps";

type Props = {
  onDisplayArchitectureClicked: () => void;
};

export const ApplyChangesNextSteps = ({
  onDisplayArchitectureClicked,
}: Props) => {
  const history = useHistory();

  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: false });

  const handleProjectOverviewClicked = useCallback(() => {
    history.push(`${baseUrl}`);
  }, [baseUrl, history]);

  return (
    <div className={className}>
      <FlexItem
        itemsAlign={EnumItemsAlign.Center}
        direction={EnumFlexDirection.Column}
        gap={EnumGapSize.Large}
        margin={EnumFlexItemMargin.Both}
      >
        <Text textStyle={EnumTextStyle.H1}>
          Your new architecture is ready!
          <span role="img" aria-label="party emoji">
            {" "}
            🎉
          </span>
        </Text>
        <Text textStyle={EnumTextStyle.H3}>What should we do next?</Text>
      </FlexItem>
      <div className={`${className}__box_container`}>
        <CommitButton
          commitBtnType={CommitBtnType.JumboButton}
          commitMessage={""}
          resourceTypeGroup={EnumResourceTypeGroup.Services} //this will always be services for BTM
          hasPendingChanges={true}
          hasMultipleServices={true}
          commitStrategy={EnumCommitStrategy.AllWithPendingChanges} //commit all with pending changes
        ></CommitButton>
        <JumboButton
          onClick={handleProjectOverviewClicked}
          text="Show my updated project overview"
          icon="services"
          circleColor={EnumTextColor.Primary}
        />
      </div>
      <FlexItem
        margin={EnumFlexItemMargin.Both}
        contentAlign={EnumContentAlign.Center}
      >
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          onClick={onDisplayArchitectureClicked}
        >
          Done
        </Button>
      </FlexItem>
    </div>
  );
};
