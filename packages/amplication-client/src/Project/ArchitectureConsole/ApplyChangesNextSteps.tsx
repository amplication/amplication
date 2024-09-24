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
import { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { AppContext } from "../../context/appContext";
import "./ApplyChangesNextSteps.scss";
import { CommitBtnType } from "../../VersionControl/Commit";
import { CompletePreviewSignupButton } from "../../User/CompletePreviewSignupButton";
import CommitButton from "../../VersionControl/CommitButton";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";
import { EnumCommitStrategy, EnumResourceTypeGroup } from "../../models";

const className = "apply-changes-next-steps";

type Props = {
  onDisplayArchitectureClicked: () => void;
};

export const ApplyChangesNextSteps = ({
  onDisplayArchitectureClicked,
}: Props) => {
  const history = useHistory();
  const { isPreviewPlan } = useContext(AppContext);

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
        {isPreviewPlan ? (
          <CompletePreviewSignupButton
            buttonText="Generate the code for my new architecture"
            buttonType={CommitBtnType.JumboButton}
          />
        ) : (
          <CommitButton
            commitBtnType={CommitBtnType.JumboButton}
            commitMessage={""}
            resourceTypeGroup={EnumResourceTypeGroup.Services} //this will always be services for BTM
            hasPendingChanges={true}
            hasMultipleServices={true}
            commitStrategy={EnumCommitStrategy.AllWithPendingChanges} //commit all with pending changes
          ></CommitButton>
        )}
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
