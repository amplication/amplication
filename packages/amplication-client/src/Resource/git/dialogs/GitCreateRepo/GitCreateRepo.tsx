import {
  Button,
  CircularProgress,
  EnumFlexDirection,
  EnumGapSize,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Label,
  Text,
  TextField,
  Toggle,
} from "@amplication/ui/design-system";
import { ApolloError, useQuery } from "@apollo/client";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { CreateGitRepositoryInput } from "../../../../models";
import { formatError } from "../../../../util/error";
import { CreateGitFormSchema } from "./CreateGitFormSchema/CreateGitFormSchema";
import "./GitCreateRepo.scss";
import { GitSelectGroup } from "../../select/GitSelectGroup";
import { GitOrganizationFromGitRepository } from "../../ResourceGitSettingsPage";
import { GET_GROUPS } from "../../queries/gitProvider";
import { GIT_REPO_CREATION_MESSAGE, GIT_REPO_NAME_RULES } from "./constants";

type Props = {
  gitOrganization: GitOrganizationFromGitRepository;
  repoCreated: {
    isRepoCreateLoading: boolean;
    RepoCreatedError: ApolloError;
  };
  onCreateGitRepository: (data: CreateGitRepositoryInput) => void;
};

const CLASS_NAME = "git-create-repo";

export default function GitCreateRepo({
  gitOrganization,
  repoCreated,
  onCreateGitRepository,
}: Props) {
  const initialValues: Partial<CreateGitRepositoryInput> = {
    name: "",
    isPublic: false,
  };

  const { data: gitGroupsData, loading: loadingGroups } = useQuery(GET_GROUPS, {
    variables: {
      organizationId: gitOrganization.id,
    },
    skip: !gitOrganization.useGroupingForRepositories,
  });

  const gitGroups = gitGroupsData?.gitGroups?.groups;
  const [repositoryGroup, setRepositoryGroup] = useState(null);

  useEffect(() => {
    if (!repositoryGroup && gitGroups && gitGroups.length > 0) {
      setRepositoryGroup(gitGroups[0]);
    }
  }, [gitGroups]);

  const processGitRepositoryName = useCallback((name: string) => {
    if (!name || name.length < 2) {
      return null;
    }
    return name
      .replace(/[^a-zA-Z0-9.\-_]/g, "-") // Replace characters other than ASCII letters, digits, ., -, and _ with -
      .replace(/-{2,}/g, "-"); // Replace consecutive dashes with a single dash
  }, []);

  const handleCreation = useCallback(
    (data: CreateGitRepositoryInput) => {
      const inputData = repositoryGroup
        ? {
            ...data,
            groupName: repositoryGroup.name,
            name: processGitRepositoryName(data.name),
          }
        : { ...data, name: processGitRepositoryName(data.name) };
      onCreateGitRepository(inputData);
    },
    [onCreateGitRepository, processGitRepositoryName, repositoryGroup]
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleCreation}
      validationSchema={CreateGitFormSchema}
      validateOnChange={false}
      validateOnBlur
    >
      {({ errors: formError, values, handleChange }) => (
        <Form className={CLASS_NAME}>
          <div className={`${CLASS_NAME}__header`}>
            Create a new {gitOrganization.provider} repository to sync your
            resource with
          </div>

          {gitOrganization.useGroupingForRepositories && (
            <>
              <GitSelectGroup
                gitProvider={gitOrganization.provider}
                selectedItem={repositoryGroup}
                items={gitGroups}
                onSelect={setRepositoryGroup}
                loadingGroups={loadingGroups}
              />
            </>
          )}

          <HorizontalRule />
          <div>
            <Toggle
              name="isPublic"
              label="Public Repository"
              checked={values.isPublic}
              onChange={handleChange}
            />
          </div>

          <div className={`${CLASS_NAME}__label`}>Repository name</div>
          <TextField
            autoFocus
            name="name"
            autoComplete="off"
            showError={false}
          />

          {!!values.name && values.name.length > 1 && (
            <FlexItem
              direction={EnumFlexDirection.Column}
              gap={EnumGapSize.Default}
            >
              <Text
                textStyle={EnumTextStyle.Subtle}
                textColor={EnumTextColor.ThemeGreen}
              >
                {GIT_REPO_CREATION_MESSAGE}
                {processGitRepositoryName(values.name)}.
              </Text>

              <Text textStyle={EnumTextStyle.Label}>{GIT_REPO_NAME_RULES}</Text>
            </FlexItem>
          )}

          <HorizontalRule />

          <Button
            type="submit"
            className={`${CLASS_NAME}__button`}
            disabled={repoCreated.isRepoCreateLoading}
          >
            {repoCreated.isRepoCreateLoading ? (
              <CircularProgress
                className={`${CLASS_NAME}__progress`}
                centerToParent
              />
            ) : (
              "Create new repository"
            )}
          </Button>
          <Label
            text={
              formError.name || formatError(repoCreated.RepoCreatedError) || ""
            }
            type="error"
          />
        </Form>
      )}
    </Formik>
  );
}
