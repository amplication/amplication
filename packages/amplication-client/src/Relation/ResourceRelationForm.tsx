import {
  EnumItemsAlign,
  EnumPanelStyle,
  FlexItem,
  Panel,
  Snackbar,
  TabContentTitle,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import BlueprintCircleBadge from "../Blueprints/BlueprintCircleBadge";
import ResourceSelectField from "../Blueprints/ResourceSelectField";
import * as models from "../models";
import { formatError } from "../util/error";
import useResourceRelations from "./hooks/useResourceRelations";
import FormikAutoSave from "../util/formikAutoSave";
import { useAppContext } from "../context/appContext";

type Props = {
  resourceId: string;
  relationDef: models.BlueprintRelation;
  relation: models.Relation | null;
};

const CLASS_NAME = "resource-relation-form";

const INITIAL_VALUES: Partial<models.Relation> = {
  relatedResources: [],
  relationKey: "",
};

function ResourceRelationsForm({ resourceId, relationDef, relation }: Props) {
  const { updateRelation, updateRelationError, updateRelationLoading } =
    useResourceRelations(resourceId);

  const {
    blueprintsMap: { blueprintsMap },
  } = useAppContext();

  const errorMessage = formatError(updateRelationError);

  const handleSubmit = useCallback(
    async (data: models.Relation) => {
      //when the field is not multi, we can a single value, so we need to wrap it in an array
      const relatedResources = relationDef.allowMultiple
        ? data.relatedResources
        : [data.relatedResources];

      updateRelation({
        variables: {
          resourceId,
          data: {
            relationKey: relationDef.key,
            relatedResources,
          },
        },
      }).catch(console.error);
    },
    [relationDef, resourceId, updateRelation]
  );

  const initialValue = {
    ...INITIAL_VALUES,
    relationKey: relationDef.key,
    ...relation,
    relatedResources: relationDef.allowMultiple
      ? relation?.relatedResources
      : relation?.relatedResources[0],
  };

  const relatedBlueprint = blueprintsMap[relationDef.relatedTo];

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={initialValue}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => {
          return (
            <>
              <Form>
                <FormikAutoSave debounceMS={100} />
                <Panel panelStyle={EnumPanelStyle.Bordered}>
                  <FlexItem
                    itemsAlign={EnumItemsAlign.Start}
                    start={
                      <BlueprintCircleBadge blueprint={relatedBlueprint} />
                    }
                  >
                    <TabContentTitle
                      title={relationDef.name}
                      subTitle={relation?.description}
                    />
                  </FlexItem>

                  <ResourceSelectField
                    label={relationDef.name}
                    isMulti={relationDef.allowMultiple}
                    name={"relatedResources"}
                    blueprintId={relatedBlueprint?.id}
                  />
                </Panel>
              </Form>
              <Snackbar
                open={Boolean(updateRelationError)}
                message={errorMessage}
              />
            </>
          );
        }}
      </Formik>
    </div>
  );
}

export default ResourceRelationsForm;
