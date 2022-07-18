import React, { useCallback, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import semver, { ReleaseType } from "semver";
import { useHistory } from "react-router-dom";
import { GlobalHotKeys } from "react-hotkeys";

import { gql, useMutation } from "@apollo/client";
import { formatError } from "../util/error";
import {
  MultiStateToggle,
  TextField,
  Snackbar,
} from "@amplication/design-system";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import "./BuildNewVersion.scss";
import { validate } from "../util/formikValidateJsonSchema";

type BuildType = {
  message: string;
};

const INITIAL_VERSION_NUMBER = "0.0.0";
const CLASS_NAME = "build-new-version";

enum EnumReleaseType {
  Major = "Major",
  Minor = "Minor",
  Patch = "Patch",
}

const RELEASE_TO_SEVER_TYPE: {
  [key in EnumReleaseType]: ReleaseType;
} = {
  [EnumReleaseType.Major]: "major",
  [EnumReleaseType.Minor]: "minor",
  [EnumReleaseType.Patch]: "patch",
};

const OPTIONS = [
  { value: EnumReleaseType.Major, label: EnumReleaseType.Major },
  { value: EnumReleaseType.Minor, label: EnumReleaseType.Minor },
  { value: EnumReleaseType.Patch, label: EnumReleaseType.Patch },
];

type Props = {
  applicationId: string;
  lastBuildVersion?: string;
  suggestedCommitMessage?: string;
  onComplete: () => void;
};

const FORM_SCHEMA = {
  required: ["message"],
  properties: {
    message: {
      type: "string",
      minLength: 1,
    },
  },
};

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const BuildNewVersion = ({
  applicationId,
  lastBuildVersion,
  suggestedCommitMessage = "",
  onComplete,
}: Props) => {
  const [releaseType, setReleaseType] = useState<EnumReleaseType>(
    EnumReleaseType.Patch
  );
  const [version, setVersion] = useState<string | null>(null);
  const history = useHistory();

  const [createBuild, { loading, error }] = useMutation<{
    createBuild: models.Build;
  }>(CREATE_BUILD, {
    onCompleted: (data) => {
      const url = `/${applicationId}/builds/${data.createBuild.id}`;
      history.push(url);

      onComplete();
    },

    variables: {
      appId: applicationId,
    },
  });

  const handleBuildButtonClick = useCallback(
    (data: BuildType) => {
      createBuild({
        variables: {
          message: data.message,
          version: version,
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [createBuild, applicationId, version]
  );
  const errorMessage = error && formatError(error);

  const handleReleaseTypeChange = useCallback((type) => {
    setReleaseType(type);
  }, []);

  useEffect(() => {
    setVersion(
      semver.inc(
        lastBuildVersion || INITIAL_VERSION_NUMBER,
        RELEASE_TO_SEVER_TYPE[releaseType]
      )
    );
  }, [lastBuildVersion, releaseType]);

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__instructions`}>
        <div>Well done!</div>
        <div>Please select the type of release</div>
      </div>
      <MultiStateToggle
        label=""
        name="version"
        options={OPTIONS}
        selectedValue={releaseType}
        onChange={handleReleaseTypeChange}
      />
      <div className={`${CLASS_NAME}__new-version-number`}>
        version &nbsp;
        <span className={`${CLASS_NAME}__new-version-number__version-number`}>
          {version}
        </span>
      </div>

      <Formik
        initialValues={{ message: suggestedCommitMessage }}
        validate={(values: BuildType) => validate(values, FORM_SCHEMA)}
        onSubmit={handleBuildButtonClick}
        validateOnMount
      >
        {(formik) => {
          const handlers = {
            SUBMIT: formik.submitForm,
          };
          return (
            <Form>
              <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
              <TextField
                rows={3}
                textarea
                name="message"
                label="What's new in this build?"
                disabled={loading}
                autoFocus
                hideLabel
                placeholder="Build description"
                autoComplete="off"
              />
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                eventData={{
                  eventName: "buildApp",
                }}
              >
                Build New Version
              </Button>
            </Form>
          );
        }}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default BuildNewVersion;

const CREATE_BUILD = gql`
  mutation($appId: String!, $version: String!, $message: String!) {
    createBuild(
      data: {
        app: { connect: { id: $appId } }
        version: $version
        message: $message
      }
    ) {
      id
      createdAt
      appId
      version
      message
      createdAt
      commitId
      actionId
      action {
        id
        steps {
          id
          name
          completedAt
          status
        }
      }
      createdBy {
        id
        account {
          firstName
          lastName
        }
      }
      status
      archiveURI
    }
  }
`;
