import React, { useCallback } from "react";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { LabelDescriptionSelector } from "./LabelDescriptionSelector";
import { WizardStepProps } from "./interfaces";

import "../CreateServiceWizard.scss";

interface Props extends WizardStepProps {
  PostgresPng: React.ReactElement<any, any>;
  MongoPng: React.ReactElement<any, any>;
  MysqlPng: React.ReactElement<any, any>;
}

const CreateServiceDatabase: React.FC<Props> = ({
  formik,
  PostgresPng,
  MongoPng,
  MysqlPng,
}) => {
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
            image={PostgresPng}
            imageSize="large"
            label="PostgreSQL"
            description="Use PostgreSQL database in Amplication service."
            onClick={handleDatabaseSelect}
            currentValue={formik.values.databaseType}
          />
          <LabelDescriptionSelector
            name="mongo"
            image={MongoPng}
            imageSize="large"
            label="MongoDB"
            description="Use MongoDB database in Amplication service."
            onClick={handleDatabaseSelect}
            currentValue={formik.values.databaseType}
          />
          <LabelDescriptionSelector
            name="mysql"
            image={MysqlPng}
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
