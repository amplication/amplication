import React, { useMemo, useCallback } from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router-dom";

import omitDeep from "deepdash-es/omitDeep";

import * as models from "../models";
import { TextField } from "../Components/TextField";
import EditableTitleField from "../Components/EditableTitleField";
import NameField from "../Components/NameField";
import FormikAutoSave from "../util/formikAutoSave";
import PermissionsPreview from "../Permissions/PermissionsPreview";
import { Panel, PanelHeader } from "../Components/Panel";
import { ENTITY_ACTIONS } from "./constants";

type EntityInput = Omit<models.Entity, "fields" | "versionNumber">;

type Props = {
  entity?: models.Entity;
  applicationId: string;
  onSubmit: (entity: EntityInput) => void;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "createdAt",
  "updatedAt",
  "versionNumber",
  "fields",
  "permissions",
  "lockedAt",
  "lockedByUser",
  "lockedByUserId",
  "__typename",
];

const EntityForm = React.memo(({ entity, applicationId, onSubmit }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omitDeep(
      {
        ...entity,
      },
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return sanitizedDefaultValues as EntityInput;
  }, [entity]);
  const history = useHistory();

  const handlePermissionsClick = useCallback(() => {
    history.push(`/${applicationId}/entities/${entity?.id}/permissions`);
  }, [history, applicationId, entity]);

  return (
    <div className="entity-form">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <>
              <Form>
                <>
                  <FormikAutoSave debounceMS={1000} />
                  <div className="form__header">
                    <EditableTitleField
                      name="displayName"
                      label="Display Name"
                    />
                    <EditableTitleField
                      secondary
                      name="description"
                      label="Description"
                    />
                  </div>
                  <div className="form__body">
                    <Panel className="form__body__general">
                      <PanelHeader title="General" />
                      <div className="form__body__general__fields">
                        <NameField name="name" />
                        <TextField
                          name="pluralDisplayName"
                          label="Plural Display Name"
                        />
                      </div>
                    </Panel>
                    <Panel className="form__body__permissions">
                      <PanelHeader
                        title="Permissions"
                        action={{
                          onClick: handlePermissionsClick,
                          icon: "edit",
                        }}
                      />
                      <PermissionsPreview
                        entityId={entity?.id}
                        availableActions={ENTITY_ACTIONS}
                        entityDisplayName={entity?.pluralDisplayName || ""}
                      />
                    </Panel>
                  </div>
                </>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
});

export default EntityForm;
