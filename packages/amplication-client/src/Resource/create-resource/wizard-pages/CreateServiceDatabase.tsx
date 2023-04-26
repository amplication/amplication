import React, { useCallback } from "react";
import "../CreateServiceWizard.scss";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { LabelDescriptionSelector } from "./LabelDescriptionSelector";
import { WizardStepProps } from "./interfaces";
import ImgSvg from "./ImgSvg";

const PLUGIN_LOGO_BASE_URL =
  "https://raw.githubusercontent.com/amplication/plugin-catalog/master/assets/icons/";

const PostgresPng = ImgSvg(`${PLUGIN_LOGO_BASE_URL}db-postgres.png`, "large");
const MongoPng = ImgSvg(`${PLUGIN_LOGO_BASE_URL}db-mongo.png`, "large");
const MysqlPng = ImgSvg(`${PLUGIN_LOGO_BASE_URL}db-mysql.png`, "large");

const CreateServiceDatabase: React.FC<WizardStepProps> = ({ formik }) => {
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
