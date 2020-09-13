import React, { useCallback, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import semver, { ReleaseType } from "semver";

import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { formatError } from "../util/error";
import { TextField } from "../Components/TextField";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { MultiStateToggle } from "../Components/MultiStateToggle";
import "./BuildNewVersion.scss";

type BuildType = {
  message: string;
};

const INITIAL_VERSION_NUMBER = "0.0.0";
const CLASS_NAME = "build-new-version";

const VERSION_MAJOR = "Major";
const VERSION_MINOR = "Minor";
const VERSION_PATCH = "Patch";

const RELEASE_TO_SEVER_TYPE: {
  [key: string]: string;
} = {
  Major: "major",
  Minor: "minor",
  Patch: "patch",
};

const OPTIONS = [
  { value: VERSION_MAJOR, label: VERSION_MAJOR },
  { value: VERSION_MINOR, label: VERSION_MINOR },
  { value: VERSION_PATCH, label: VERSION_PATCH },
];
const INITIAL_VALUES: BuildType = {
  message: "",
};

type Props = {
  applicationId: string;
  lastBuildVersion?: string;
  onComplete: () => void;
};

const BuildNewVersion = ({
  applicationId,
  lastBuildVersion,
  onComplete,
}: Props) => {
  const [releaseType, setReleaseType] = useState<string>(VERSION_PATCH);
  const [version, setVersion] = useState<string | null>(null);

  const [createBuild, { loading, error }] = useMutation<{
    createBuild: models.Build;
  }>(CREATE_BUILD, {
    onCompleted: (data) => {
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
        RELEASE_TO_SEVER_TYPE[releaseType] as ReleaseType
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

      <Formik initialValues={INITIAL_VALUES} onSubmit={handleBuildButtonClick}>
        <Form>
          <TextField
            required
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
          <Button buttonStyle={EnumButtonStyle.Primary}>
            Build New Version
          </Button>
        </Form>
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
      createdBy {
        id
      }
      status
    }
  }
`;
