import React, { useCallback } from "react";
import { match } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Formik, Form } from "formik";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import * as models from "../models";
import { formatError } from "../util/error";
import FormikAutoSave from "../util/formikAutoSave";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import ApplicationBadge from "./ApplicationBadge";
import EditableTitleField from "../Components/EditableTitleField";
import { EnumPanelStyle, Panel } from "../Components/Panel";
import "./ApplicationHome.scss";

type Props = {
  match: match<{ application: string }>;
};

type TData = {
  updateApp: models.App;
};

type Values = {
  name: string;
  description: string;
};

const CLASS_NAME = "application-home";

const INITIAL_VALUES: Values = {
  name: "",
  description: "",
};

function ApplicationHome({ match }: Props) {
  const applicationId = match.params.application;

  const {
    data: getAppData,
    loading: getAppLoading,
    error: getAppError,
  } = useQuery<{
    app: models.App;
  }>(GET_APPLICATION, {
    variables: {
      id: applicationId,
    },
  });

  const [updateApp, { error: updateError }] = useMutation<TData>(UPDATE_APP);

  const errorMessage = formatError(updateError || getAppError);

  const handleSubmit = useCallback(
    (data) => {
      const { name, description } = data;
      updateApp({
        variables: {
          data: {
            name,
            description,
          },
          appId: applicationId,
        },
      }).catch(console.error);
    },
    [updateApp, applicationId]
  );

  if (getAppLoading) {
    return <span>Loading...</span>;
  }

  return (
    <PageContent className={CLASS_NAME} withFloatingBar>
      <main>
        <FloatingToolbar />
        <Panel
          className={`${CLASS_NAME}__info`}
          panelStyle={EnumPanelStyle.Transparent}
        >
          <div className={`${CLASS_NAME}__info__badge`}>
            <ApplicationBadge
              name={getAppData?.app.name || ""}
              expanded
              large
              hideFullName
            />
          </div>
          <div className={`${CLASS_NAME}__info__name`}>
            <Formik
              initialValues={getAppData?.app || INITIAL_VALUES}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {(formik) => {
                return (
                  <>
                    <Form>
                      <FormikAutoSave debounceMS={1000} />
                      <EditableTitleField
                        name="name"
                        label="Application Name"
                      />
                      <EditableTitleField
                        secondary
                        name="description"
                        label="Description"
                      />
                    </Form>
                  </>
                );
              }}
            </Formik>
          </div>
        </Panel>
      </main>
      <Snackbar
        open={Boolean(updateError || getAppError)}
        message={errorMessage}
      />
    </PageContent>
  );
}

export default ApplicationHome;

export const GET_APPLICATION = gql`
  query getApplication($id: String!) {
    app(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
    }
  }
`;

const UPDATE_APP = gql`
  mutation updateApp($data: AppUpdateInput!, $appId: String!) {
    updateApp(data: $data, where: { id: $appId }) {
      id
      createdAt
      updatedAt
      name
      description
    }
  }
`;
