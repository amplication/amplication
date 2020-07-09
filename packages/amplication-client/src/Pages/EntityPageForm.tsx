import React, { useCallback, useState, useMemo } from "react";
import { Formik, Form } from "formik";
import omit from "lodash.omit";
import { TabBar, Tab } from "@rmwc/tabs";
import "@rmwc/tabs/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import * as types from "../types";
import NameField from "../Entities/fields/NameField";
import { TextField } from "../Entities/fields/TextField";
import { BooleanField } from "../Entities/fields/BooleanField";
import { CheckboxField } from "../Entities/fields/CheckboxField";
import { SelectField } from "../Components/SelectField";
import { MultiStateToggle } from "../Components/MultiStateToggle";

type Props = {
  entityPage?: types.EntityPage;
  onSubmit: (entityPage: types.EntityPage) => void;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
];

enum SidebarTab {
  Properties,
  Display,
}

const PAGE_TYPES = [
  { value: types.EnumEntityPageType.SingleRecord, text: "Single Record" },
  { value: types.EnumEntityPageType.List, text: "List" },
];

export const INITIAL_VALUES: types.EntityPage = {
  name: "",
  description: "",
  pageType: types.EnumEntityPageType.SingleRecord,
  listSettings: undefined,
  singleRecordSettings: {
    allowCreation: true,
    allowDeletion: false,
    allowUpdate: false,
    showAllFields: true,
    showFieldList: [],
  },
  blockType: "EntityPage",
  entityId: "",
  id: "",
  versionNumber: 0,
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
    const sanitizedDefaultValues = omit(
      entityPage,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    };
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
                      <NameField name="name" />
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
                            name="singleRecordSettings.enableSearch"
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
