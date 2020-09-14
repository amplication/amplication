import React, { useState, useCallback } from "react";
import { match } from "react-router-dom";
import { Formik, Form } from "formik";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import PageContent from "../Layout/PageContent";
import FloatingToolbar from "../Layout/FloatingToolbar";
import ApplicationBadge from "./ApplicationBadge";
import * as models from "../models";
import EditableTitleField from "../Components/EditableTitleField";
import "@rmwc/tabs/styles";
import "./ApplicationHome.scss";
import { EnumPanelStyle, Panel } from "../Components/Panel";
import FormikAutoSave from "../util/formikAutoSave";

type Props = {
  match: match<{ application: string }>;
};

type DType = {
  updateApp: models.App;
};

const CLASS_NAME = "application-home";

const INITIAL_VALUES = {
  name: "",
  description: "",
};

function ApplicationHome({ match }: Props) {
  const { data, loading } = useQuery<{ app: models.App }>(GET_APPLICATION, {
    variables: {
      id: match.params.application,
    },
  });

  const handleSubmit = useCallback((data: models.AppUpdateInput) => {
    console.log(data);
  }, []);

  if (loading) {
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
              name={data?.app.name || ""}
              expanded
              large
              hideFullName
            />
          </div>
          <div className={`${CLASS_NAME}__info__name`}>
            <Formik
              initialValues={data?.app || INITIAL_VALUES}
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
    </PageContent>
  );
}

export default ApplicationHome;

export const GET_APPLICATION = gql`
  query getApplication($id: String!) {
    app(where: { id: $id }) {
      id
      name
      description
    }
  }
`;
