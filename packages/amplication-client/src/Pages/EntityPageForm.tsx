import React, { useCallback, useState, useMemo } from "react";
import { Formik, Form } from "formik";

import omitDeep from "deepdash-es/omitDeep";

import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { TabBar, Tab } from "@rmwc/tabs";
import "@rmwc/tabs/styles";

import { DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import * as models from "../models";
import { TextField } from "../Components/TextField";
import { CheckboxField } from "../Components/CheckboxField";
import { SelectField } from "../Components/SelectField";
import PageSelectField from "./PageSelectField";
import { MultiStateToggleField } from "../Components/MultiStateToggleField";
import EntityFieldMultiSelect from "./EntityFieldMultiSelect";
import { Button } from "../Components/Button";
import { HeaderToolbar } from "../util/teleporter";

type EntityPageInput = Omit<models.EntityPage, "blockType" | "versionNumber">;

type TEntities = {
  entities: [
    {
      id: string;
      displayName: string;
    }
  ];
};

type TPages = {
  blocks: [
    {
      id: string;
      displayName: string;
    }
  ];
};

type Props = {
  entityPage?: models.EntityPage;
  onSubmit: (entityPage: EntityPageInput) => void;
  applicationId: string;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "createdAt",
  "updatedAt",
  "blockType",
  "versionNumber",
  "__typename",
];

enum SidebarTab {
  Properties,
  Display,
}

const PAGE_TYPES = [
  { value: models.EnumEntityPageType.SingleRecord, label: "Single Record" },
  { value: models.EnumEntityPageType.List, label: "List" },
];

export const INITIAL_VALUES: Omit<
  models.EntityPage,
  "createdAt" | "updatedAt" | "inputParameters" | "outputParameters"
> = {
  displayName: "",
  description: "",
  pageType: models.EnumEntityPageType.SingleRecord,
  blockType: models.EnumBlockType.EntityPage,
  entityId: "",
  id: "",
  versionNumber: 0,
  showAllFields: true,
  showFieldList: [],
};

const PAGE_TYPE_INITIAL_VALUES: {
  [page: string]: Object;
} = {
  [models.EnumEntityPageType.List]: {
    listSettings: {
      enableSearch: true,
      navigateToPageId: "",
    },
  },
  [models.EnumEntityPageType.SingleRecord]: {
    singleRecordSettings: {
      allowCreation: true,
      allowDeletion: false,
      allowUpdate: false,
    },
  },
};

const EntityPageForm = ({ entityPage, onSubmit, applicationId }: Props) => {
  const { data: entityList } = useQuery<TEntities>(GET_ENTITIES, {
    variables: {
      appId: applicationId,
    },
  });

  const entityListOptions = useMemo(() => {
    return entityList
      ? entityList.entities.map((entity) => ({
          value: entity.id,
          label: entity.displayName,
        }))
      : [];
  }, [entityList]);

  const [selectedTab, setSelectedTab] = useState<SidebarTab>(
    SidebarTab.Properties
  );

  const handleActivate = useCallback(
    (event) => {
      setSelectedTab(event.detail.index);
    },
    [setSelectedTab]
  );

  const initialValues = useMemo(() => {
    const pageTypeInitialValues =
      (entityPage && PAGE_TYPE_INITIAL_VALUES[entityPage.pageType]) ||
      PAGE_TYPE_INITIAL_VALUES[models.EnumEntityPageType.SingleRecord];

    const sanitizedDefaultValues = omitDeep(
      {
        ...INITIAL_VALUES,
        ...pageTypeInitialValues,
        ...entityPage,
      },
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return sanitizedDefaultValues as EntityPageInput;
  }, [entityPage]);

  return (
    <div className="entity-page-form">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <>
              <TabBar activeTabIndex={selectedTab} onActivate={handleActivate}>
                <Tab>Properties</Tab>
                <Tab>Display</Tab>
              </TabBar>
              <DrawerHeader>
                <DrawerTitle>{formik.values.displayName}</DrawerTitle>
              </DrawerHeader>
              <DrawerContent>
                <Form>
                  <HeaderToolbar.Source>
                    <Button onClick={formik.submitForm}>Save</Button>
                  </HeaderToolbar.Source>
                  {selectedTab === SidebarTab.Properties && (
                    <>
                      <p>
                        <TextField name="displayName" label="Display Name" />
                      </p>
                      <p>
                        <TextField
                          name="description"
                          label="Description"
                          textarea
                          rows={3}
                        />
                      </p>
                      <hr />

                      <p>
                        <SelectField
                          name="entityId"
                          label="Entity"
                          options={entityListOptions}
                        />
                      </p>
                      <p>
                        <MultiStateToggleField
                          label="Page Type"
                          name="pageType"
                          options={PAGE_TYPES}
                        />
                      </p>
                      {formik.values.pageType ===
                        models.EnumEntityPageType.SingleRecord && (
                        <>
                          <p>
                            <CheckboxField
                              name="singleRecordSettings.allowCreation"
                              label="Create"
                            />
                          </p>
                          <p>
                            <CheckboxField
                              name="singleRecordSettings.allowDeletion"
                              label="Delete"
                            />
                          </p>
                          <p>
                            <CheckboxField
                              name="singleRecordSettings.allowUpdate"
                              label="Update"
                            />
                          </p>
                        </>
                      )}
                      {formik.values.pageType ===
                        models.EnumEntityPageType.List && (
                        <>
                          <p>
                            <PageSelectField
                              name="listSettings.navigateToPageId"
                              label="Navigate To"
                              applicationId={applicationId}
                            />
                          </p>
                          <p>
                            <CheckboxField
                              name="listSettings.allowCreation"
                              label="Create"
                            />
                          </p>
                          <p>
                            <CheckboxField
                              name="listSettings.allowDeletion"
                              label="Delete"
                            />
                          </p>
                          <p>
                            <CheckboxField
                              name="listSettings.enableSearch"
                              label="Search"
                            />
                          </p>
                        </>
                      )}
                    </>
                  )}
                  {selectedTab === SidebarTab.Display && (
                    <>
                      <p>
                        <CheckboxField
                          name="showAllFields"
                          label="Show All Fields"
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            formik.setFieldValue(
                              "showAllFields",
                              event.target.checked
                            );
                            formik.setFieldValue("showFieldList", []);
                          }}
                        />
                        <EntityFieldMultiSelect
                          entityId={formik.values.entityId}
                          name="showFieldList"
                          onChange={() => {
                            formik.setFieldValue("showAllFields", false);
                          }}
                        />
                      </p>
                    </>
                  )}
                </Form>
              </DrawerContent>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default EntityPageForm;

export const GET_ENTITIES = gql`
  query getEntities($appId: String!) {
    entities(where: { app: { id: $appId } }) {
      id
      displayName
    }
  }
`;
