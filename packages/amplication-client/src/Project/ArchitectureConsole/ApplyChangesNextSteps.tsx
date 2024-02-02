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
import { ApolloError, useMutation } from "@apollo/client";
import { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { COMMIT_CHANGES } from "../../VersionControl/Commit";
import { AppContext } from "../../context/appContext";
import { Commit, EnumSubscriptionPlan } from "../../models";
import "./ApplyChangesNextSteps.scss";

const className = "apply-changes-next-steps";

type Props = {
  onDisplayArchitectureClicked: () => void;
};

type TData = {
  commit: Commit;
};

export const ApplyChangesNextSteps = ({
  onDisplayArchitectureClicked,
}: Props) => {
  const history = useHistory();
  const {
    currentWorkspace,
    currentProject,
    commitUtils,
    setCommitRunning,
    resetPendingChanges,
    setPendingChangesError,
  } = useContext(AppContext);

  const [commit, { error, loading }] = useMutation<TData>(COMMIT_CHANGES, {
    onError: (error: ApolloError) => {
      setCommitRunning(false);
      setPendingChangesError(true);
    },
    onCompleted: (response) => {
      setCommitRunning(false);
      setPendingChangesError(false);
      resetPendingChanges();
      commitUtils.refetchCommitsData(true);

      return history.push(`commits/${response.commit.id}`);
    },
  });

  const handleGenerateCodeClicked = useCallback(() => {
    setCommitRunning(true);
    commit({
      variables: {
        message: "Architecture changes Commit",
        projectId: currentProject.id,
        bypassLimitations:
          currentWorkspace?.subscription?.subscriptionPlan !==
            EnumSubscriptionPlan.Pro ?? false,
      },
    }).catch(console.error);
  }, [setCommitRunning, commit, currentProject, currentWorkspace]);

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
        <JumboButton
          onClick={handleGenerateCodeClicked}
          text="Generate the code for my new architecture"
          icon="pending_changes"
          circleColor={EnumTextColor.ThemeTurquoise}
        ></JumboButton>

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
