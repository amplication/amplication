import React, { useCallback } from "react";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { LabelDescriptionSelector } from "./LabelDescriptionSelector";
import { WizardStepProps } from "./interfaces";

import "../CreateServiceWizard.scss";
import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";

interface Props extends WizardStepProps {
  PostgresPng: React.ReactElement<any, any>;
  MongoPng: React.ReactElement<any, any>;
  MysqlPng: React.ReactElement<any, any>;
  MsSqlPng: React.ReactElement<any, any>;
}

const CreateServiceDatabase: React.FC<Props> = ({
  formik,
  PostgresPng,
  MongoPng,
  MysqlPng,
  MsSqlPng,
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
          
          You can easily change the type of the DB later in the plugins page.
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
            description="Open-source object-relational database with a strong community"
            onClick={handleDatabaseSelect}
            currentValue={formik.values.databaseType}
          />
          <LabelDescriptionSelector
            name="mongo"
            image={MongoPng}
            imageSize="large"
            label="MongoDB"
            description="Scalable NoSQL database for unstructured data"
            onClick={handleDatabaseSelect}
            currentValue={formik.values.databaseType}
          />
          <LabelDescriptionSelector
            name="mysql"
            image={MysqlPng}
            imageSize="large"
            label="MySQL"
            description="Reliable open-source relational database for web applications"
            onClick={handleDatabaseSelect}
            currentValue={formik.values.databaseType}
          />
          <LabelDescriptionSelector
            name="sqlserver"
            imageSize="large"
            image={MsSqlPng}
            label="MS SQL Server"
            description="High-performance, secure relational database by Microsoft"
            onClick={handleDatabaseSelect}
            currentValue={formik.values.databaseType}
          />
        </Layout.SelectorWrapper>
        <FlexItem margin={EnumFlexItemMargin.Top}>
          <Text textStyle={EnumTextStyle.Tag}>
            Need a different database? You can customize and extend your
            services with our community-driven plugin system.
          </Text>
        </FlexItem>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateServiceDatabase;
