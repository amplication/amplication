import React, { useCallback, useEffect } from "react";
import "../CreateServiceWizard.scss";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { LabelDescriptionSelector } from "./LabelDescriptionSelector";
import { WizardStepProps } from "./interfaces";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";

const CreateServiceDatabase: React.FC<WizardStepProps> = ({
  formik,
  trackWizardPageEvent,
}) => {
  useEffect(() => {
    trackWizardPageEvent(AnalyticsEventNames.ViewServiceWizardStep_DBSettings);
  }, []);

  const PLUGIN_LOGO_BASE_URL =
    "https://raw.githubusercontent.com/amplication/plugin-catalog/master/assets/icons/";

  const handleDatabaseSelect = useCallback(
    (database: string) => {
      formik.setValues(
        {
          ...formik.values,
          databaseType: database,
        },
        true
      );
    },
    [formik.values]
  );
  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header="Which database do you want to use?"
          text={`Amplication generates the service with all the required configuration and code to start working with a DB. 
          
          You can easily change the type of the DB later in the plugins page
          `}
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <Layout.SelectorWrapper>
          <LabelDescriptionSelector
            name="postgres"
            image={`${PLUGIN_LOGO_BASE_URL}db-postgres.png`}
            imageSize="large"
            label="PostgreSQL"
            description="Use PostgreSQL database in Amplication service."
            onClick={handleDatabaseSelect}
            currentValue={formik.values.databaseType}
          />
          <LabelDescriptionSelector
            name="mongo"
            image={`${PLUGIN_LOGO_BASE_URL}db-mongo.png`}
            imageSize="large"
            label="MongoDB"
            description="Use MongoDB database in Amplication service."
            onClick={handleDatabaseSelect}
            currentValue={formik.values.databaseType}
          />
          <LabelDescriptionSelector
            name="mysql"
            image={`${PLUGIN_LOGO_BASE_URL}db-mysql.png`}
            imageSize="large"
            label="MySQL"
            description="Use MySQL database in Amplication service.."
            onClick={handleDatabaseSelect}
            currentValue={formik.values.databaseType}
          />
        </Layout.SelectorWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateServiceDatabase;
