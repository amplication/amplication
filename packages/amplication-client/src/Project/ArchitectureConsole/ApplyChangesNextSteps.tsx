import { CircleBadge, Icon } from "@amplication/ui/design-system";
import { useCallback, useContext } from "react";
import { AppContext } from "../../context/appContext";
import { useHistory } from "react-router-dom";
import "./ApplyChangesNextSteps.scss";
import { ApolloError, useMutation } from "@apollo/client";
import { COMMIT_CHANGES } from "../../VersionControl/Commit";
import { Commit, EnumSubscriptionPlan } from "../../models";
import { Button, EnumButtonStyle } from "../../Components/Button";

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

      // setOpenLimitationDialog(
      //   error?.graphQLErrors?.some(
      //     (gqlError) =>
      //       gqlError.extensions.code ===
      //       GraphQLErrorCode.BILLING_LIMITATION_ERROR
      //   ) ?? false
      // );
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
      <h2>
        <span> Your new architecture is ready! </span>
        <span role="img" aria-label="party emoji">
          🎉
        </span>
      </h2>
      <span>What should we do next?</span>
      <div className={`${className}__box_container`}>
        <div
          className={`${className}__box`}
          onClick={handleGenerateCodeClicked}
        >
          <CircleBadge color="#53DBEE" size="medium">
            <Icon icon="pending_changes" size="small" />
          </CircleBadge>
          <span>Generate the code</span>
          <span>for my new architecture</span>
        </div>
        <div
          className={`${className}__box`}
          onClick={handleProjectOverviewClicked}
        >
          <CircleBadge color="#f85b6e" size="medium">
            <Icon icon="services" size="small" />
          </CircleBadge>
          <span>Show my updated</span>
          <span>project overview</span>
        </div>
      </div>
      <Button
        buttonStyle={EnumButtonStyle.Outline}
        onClick={onDisplayArchitectureClicked}
      >
        Close
      </Button>
    </div>
  );
};
