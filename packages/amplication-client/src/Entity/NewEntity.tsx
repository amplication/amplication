import { Dialog, Snackbar, TextField } from "@amplication/ui/design-system";
import { Reference, useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import { pascalCase } from "pascal-case";
import { useCallback, useContext, useEffect, useState } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import {
  generatePluralDisplayName,
  generateSingularDisplayName,
} from "../Components/PluralDisplayNameField";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { DIALOG_CLASS_NAME } from "../Plugins/PluginsCatalog";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import {
  CREATE_DEFAULT_ENTITIES,
  CREATE_ENTITY,
  NEW_ENTITY_FRAGMENT,
} from "../Workspaces/queries/entitiesQueries";
import { USER_ENTITY } from "./constants";
import "./NewEntity.scss";

type CreateEntityType = Omit<models.EntityCreateInput, "resource">;

type DType = {
  createOneEntity: models.Entity;
};

export type TEntities = {
  createDefaultEntities: [
    {
      id: string;
      displayName: string;
      name: string;
    }
  ];
};

type Props = {
  resourceId: string;
  onSuccess: () => void;
};

const INITIAL_VALUES: CreateEntityType = {
  name: "",
  displayName: "",
  pluralDisplayName: "",
  description: "",
};

const FORM_SCHEMA = {
  required: ["displayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 2,
    },
  },
};
const CLASS_NAME = "new-entity";

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const NewEntity = ({ resourceId, onSuccess }: Props) => {
  const history = useHistory();
  const { addEntity, currentWorkspace, currentProject } =
    useContext(AppContext);

  const [confirmInstall, setConfirmInstall] = useState<boolean>(false);

  const [currentNewEntity, setCurrentNewEntity] =
    useState<CreateEntityType>(null);

  const [createEntity, { error, data, loading }] = useMutation<DType>(
    CREATE_ENTITY,
    {
      onCompleted: (data) => {
        addEntity(data.createOneEntity.id);

        onSuccess();
        history.push(`entities/${data.createOneEntity.id}`);
      },
      update(cache, { data }) {
        if (!data) return;

        const newEntity = data.createOneEntity;

        cache.modify({
          fields: {
            entities(existingEntityRefs = [], { readField }) {
              const newEntityRef = cache.writeFragment({
                data: newEntity,
                fragment: NEW_ENTITY_FRAGMENT,
              });

              if (
                existingEntityRefs.some(
                  (EntityRef: Reference) =>
                    readField("id", EntityRef) === newEntity.id
                )
              ) {
                return existingEntityRefs;
              }

              return [...existingEntityRefs, newEntityRef];
            },
          },
        });
      },
    }
  );

  const [createDefaultEntities, { data: defaultEntityData }] =
    useMutation<TEntities>(CREATE_DEFAULT_ENTITIES, {
      onCompleted: (data) => {
        if (!data) return;
        const userEntity = data.createDefaultEntities.find(
          (x) => x.name.toLowerCase() === USER_ENTITY.toLowerCase()
        );
        addEntity(userEntity.id);
        onSuccess();
        history.push(`entities/${userEntity.id}`);
      },
      update(cache, { data }) {
        if (!data) return;
        const userEntity = data.createDefaultEntities.find(
          (x) => x.name.toLowerCase() === USER_ENTITY.toLowerCase()
        );
        const newEntity = userEntity;
        cache.modify({
          fields: {
            entities(existingEntityRefs = [], { readField }) {
              const newEntityRef = cache.writeFragment({
                data: newEntity,
                fragment: NEW_ENTITY_FRAGMENT,
              });
              if (
                existingEntityRefs.some(
                  (EntityRef: Reference) =>
                    readField("id", EntityRef) === newEntity.id
                )
              ) {
                return existingEntityRefs;
              }
              return [...existingEntityRefs, newEntityRef];
            },
          },
        });
      },
    });

  const handleSubmit = useCallback(
    (data: CreateEntityType) => {
      if (data.displayName.toLowerCase() === USER_ENTITY.toLowerCase()) {
        setCurrentNewEntity(data);
        setConfirmInstall(true);
        return;
      }

      const displayName = data.displayName.trim();
      const pluralDisplayName = generatePluralDisplayName(displayName);
      const singularDisplayName = generateSingularDisplayName(displayName);
      const name = pascalCase(singularDisplayName);

      createEntity({
        variables: {
          data: {
            ...data,
            displayName,
            name,
            pluralDisplayName,
            resource: { connect: { id: resourceId } },
          },
        },
      }).catch(console.error);
    },
    [createEntity, setCurrentNewEntity, setConfirmInstall, resourceId]
  );

  const handleDismissConfirmationInstall = useCallback(() => {
    setConfirmInstall(false);
  }, [setConfirmInstall]);

  const handleConfirmationInstall = useCallback(() => {
    createDefaultEntities({
      variables: {
        data: {
          resourceId,
        },
      },
    }).catch(console.error);
  }, [setConfirmInstall, createDefaultEntities, resourceId]);

  const handleDismissInstall = useCallback(() => {
    setConfirmInstall(false);
    const displayName = currentNewEntity.displayName.trim();
    const pluralDisplayName = generatePluralDisplayName(displayName);
    const singularDisplayName = generateSingularDisplayName(displayName);
    const name = pascalCase(singularDisplayName);

    createEntity({
      variables: {
        data: {
          displayName,
          pluralDisplayName,
          name,

          resource: { connect: { id: resourceId } },
        },
      },
    }).catch(console.error);
  }, [setConfirmInstall, createEntity, resourceId, currentNewEntity]);

  useEffect(() => {
    if (data) {
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${data.createOneEntity.id}`
      );
    }
  }, [history, data, resourceId, currentWorkspace, currentProject]);

  useEffect(() => {
    if (defaultEntityData) {
      const userEntity = defaultEntityData.createDefaultEntities.find(
        (x) => x.name.toLowerCase() === USER_ENTITY.toLowerCase()
      );
      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${userEntity.id}`
      );
    }
  }, [
    history,
    defaultEntityData,
    resourceId,
    currentWorkspace,
    currentProject,
  ]);

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <SvgThemeImage image={EnumImages.Entities} />
      <div className={`${CLASS_NAME}__instructions`}>
        Give your new entity a descriptive name. <br />
        For example: Customer, Support Ticket, Purchase Order...
      </div>
      <Dialog
        title="Restore 'User' Entity?"
        className={DIALOG_CLASS_NAME}
        isOpen={confirmInstall}
        onDismiss={handleDismissConfirmationInstall}
      >
        <div className={`${DIALOG_CLASS_NAME}__message__keep_building`}>
          We've noticed you're creating a new 'User' entity. This entity is used
          by the Authentication plugin.
        </div>
        <div className={`${DIALOG_CLASS_NAME}__message__keep_building`}>
          Restore the Default 'User' Entity - This will re-establish the
          original 'User' entity provided by Amplication, including all
          associated settings and functionalities.
        </div>
        <div className={`${CLASS_NAME}__dialog_btn`}>
          <Button
            className={`${DIALOG_CLASS_NAME}__upgrade_button`}
            buttonStyle={EnumButtonStyle.Primary}
            onClick={handleConfirmationInstall}
          >
            Restore Default
          </Button>
        </div>
      </Dialog>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: CreateEntityType) => validate(values, FORM_SCHEMA)}
        onSubmit={handleSubmit}
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
                name="displayName"
                label="New Entity Name"
                disabled={loading}
                autoFocus
                hideLabel
                placeholder="Type New Entity Name"
                autoComplete="off"
              />
              <Button
                type="submit"
                buttonStyle={EnumButtonStyle.Primary}
                disabled={!formik.isValid || loading}
              >
                Create Entity
              </Button>
            </Form>
          );
        }}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewEntity;
