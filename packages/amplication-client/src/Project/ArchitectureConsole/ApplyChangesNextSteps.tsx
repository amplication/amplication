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
import Commit, { CommitBtnType } from "../../VersionControl/Commit";
import { CompletePreviewSignupButton } from "../../User/CompletePreviewSignupButton";

const className = "apply-changes-next-steps";

type Props = {
  onDisplayArchitectureClicked: () => void;
  onCommitChangesError: () => void;
};

export const ApplyChangesNextSteps = ({
  onDisplayArchitectureClicked,
  onCommitChangesError,
}: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject, isPreviewPlan } =
    useContext(AppContext);

  const handleProjectOverviewClicked = useCallback(() => {
    history.push(`/${currentWorkspace.id}/${currentProject.id}`);
  }, [currentWorkspace, currentProject, history]);

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
          <Commit
            projectId={currentProject.id}
            noChanges
            showCommitMessage={false}
            commitMessage="Architecture redesign"
            commitBtnType={CommitBtnType.JumboButton}
            onCommitChangesError={onCommitChangesError}
          ></Commit>
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
