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
import { SelectField } from "../Entities/fields/SelectField";

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
                      <SelectField name="entityId" label="Entity" />
                    </p>
                    <p>
                      <BooleanField name="allowCreate" label="Create" />
                    </p>
                    <p>
                      <BooleanField name="allowDelete" label="Delete" />
                    </p>
                    <p>
                      <BooleanField name="allowUpdate" label="Update" />
                    </p>

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
