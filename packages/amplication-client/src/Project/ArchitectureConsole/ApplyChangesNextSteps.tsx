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

const className = "apply-changes-next-steps";

type Props = {
  onDisplayArchitectureClicked: () => void;
};

export const ApplyChangesNextSteps = ({
  onDisplayArchitectureClicked,
}: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

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
        <Commit
          projectId={currentProject.id}
          noChanges
          showCommitMessage={false}
          commitMessage="Architecture redesign"
          commitBtnType={CommitBtnType.JumboButton}
        ></Commit>

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
