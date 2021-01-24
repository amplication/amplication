import React, { useMemo, useCallback } from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router-dom";

import omitDeep from "deepdash-es/omitDeep";

import * as models from "../models";
import {
  TextField,
  Panel,
  PanelHeader,
  EnumPanelStyle,
} from "@amplication/design-system";
import { DisplayNameField } from "../Components/DisplayNameField";
import EditableTitleField from "../Components/EditableTitleField";
import NameField from "../Components/NameField";
import FormikAutoSave from "../util/formikAutoSave";
import PermissionsPreview from "../Permissions/PermissionsPreview";
import { ENTITY_ACTIONS, USER_ENTITY } from "./constants";
import { Button, EnumButtonStyle } from "../Components/Button";
import { validate } from "../util/formikValidateJsonSchema";

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

const FORM_SCHEMA = {
  required: ["name", "displayName", "pluralDisplayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 2,
    },
    name: {
      type: "string",
      minLength: 2,
    },
    pluralDisplayName: {
      type: "string",
      minLength: 2,
    },
  },
};

const CLASS_NAME = "entity-form";

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
    <div className={CLASS_NAME}>
      <Formik
        initialValues={initialValues}
        validate={(values: EntityInput) => validate(values, FORM_SCHEMA)}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <>
                <FormikAutoSave debounceMS={1000} />

                <DisplayNameField name="displayName" label="Display Name" />

                <NameField
                  name="name"
                  disabled={USER_ENTITY === entity?.name}
                  capitalized
                />
                <TextField
                  name="pluralDisplayName"
                  label="Plural Display Name"
                />
                <TextField
                  autoComplete="off"
                  textarea
                  rows={3}
                  name="description"
                  label="Description"
                />
                <Panel
                  className={`${CLASS_NAME}__permissions`}
                  panelStyle={EnumPanelStyle.Bordered}
                >
                  <PanelHeader>
                    <h2>Permissions</h2>
                    <Button
                      buttonStyle={EnumButtonStyle.Clear}
                      icon="edit"
                      type="button"
                      onClick={handlePermissionsClick}
                    />
                  </PanelHeader>
                  <PermissionsPreview
                    entityId={entity?.id}
                    availableActions={ENTITY_ACTIONS}
                    entityDisplayName={entity?.pluralDisplayName || ""}
                  />
                </Panel>
              </>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
});

export default EntityForm;
