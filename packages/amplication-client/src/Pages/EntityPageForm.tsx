import React, { useCallback, useState, useMemo } from "react";
import { Formik, Form } from "formik";

/**@todo: create module */
// @ts-ignore
import omitDeep from "omit-deep";

import { TabBar, Tab } from "@rmwc/tabs";
import "@rmwc/tabs/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import * as types from "../types";
import { TextField } from "../Components/TextField";
import { CheckboxField } from "../Components/CheckboxField";
import { SelectField } from "../Components/SelectField";
import { MultiStateToggle } from "../Components/MultiStateToggle";

type EntityPageInput = Omit<types.EntityPage, "blockType" | "versionNumber">;

type Props = {
  entityPage?: types.EntityPage;
  onSubmit: (entityPage: EntityPageInput) => void;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "createdAt",
  "updatedAt",
  "__typename",
  "blockType",
  "versionNumber",
  "__typename",
];

enum SidebarTab {
  Properties,
  Display,
}

const PAGE_TYPES = [
  { value: types.EnumEntityPageType.SingleRecord, label: "Single Record" },
  { value: types.EnumEntityPageType.List, label: "List" },
];

export const INITIAL_VALUES: types.EntityPage = {
  name: "",
  description: "",
  pageType: types.EnumEntityPageType.SingleRecord,
  blockType: "EntityPage",
  entityId: "",
  id: "",
  versionNumber: 0,
};

const PAGE_TYPE_INITIAL_VALUES: {
  [page: string]: Object;
} = {
  [types.EnumEntityPageType.List]: {
    listSettings: {
      showAllFields: true,
      showFieldList: [],
      enableSearch: true,
      navigateToPageId: "",
    },
  },
  [types.EnumEntityPageType.SingleRecord]: {
    singleRecordSettings: {
      allowCreation: true,
      allowDeletion: false,
      allowUpdate: false,
      showAllFields: true,
      showFieldList: [],
    },
  },
};

const EntityPageForm = ({ entityPage, onSubmit }: Props) => {
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
      PAGE_TYPE_INITIAL_VALUES[types.EnumEntityPageType.SingleRecord];

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
      <TabBar activeTabIndex={selectedTab} onActivate={handleActivate}>
        <Tab>Properties</Tab>
        <Tab>Display</Tab>
      </TabBar>
      {selectedTab === SidebarTab.Properties && (
        <>
          <DrawerHeader>
            <DrawerTitle>{entityPage?.name}</DrawerTitle>
          </DrawerHeader>
          <DrawerContent>
            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={onSubmit}
            >
              {(formik) => {
                return (
                  <Form>
                    <p>
                      <TextField name="name" label="Name" />
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
                        options={PAGE_TYPES}
                      />
                    </p>
                    <p>
                      <MultiStateToggle
                        label="Page Type"
                        name="pageType"
                        options={PAGE_TYPES}
                      ></MultiStateToggle>
                      <SelectField
                        name="pageType"
                        label="Page Type"
                        options={PAGE_TYPES}
                      />
                    </p>
                    {formik.values.pageType ===
                      types.EnumEntityPageType.SingleRecord && (
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
                      types.EnumEntityPageType.List && (
                      <>
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

                        <p>
                          <SelectField
                            name="listSettings.navigateToPageId"
                            label="Navigate To"
                            options={PAGE_TYPES}
                          />
                        </p>
                        <p>
                          <CheckboxField
                            name="listSettings.showAllFields"
                            label="Show All Fields"
                          />
                        </p>
                      </>
                    )}

                    <p>
                      <Button type="submit" raised>
                        Save
                      </Button>
                    </p>
                  </Form>
                );
              }}
            </Formik>
          </DrawerContent>
        </>
      )}

      {selectedTab === SidebarTab.Display && "hello Display"}
    </div>
  );
};

export default EntityPageForm;
