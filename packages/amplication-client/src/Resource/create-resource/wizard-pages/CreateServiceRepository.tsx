import {
  Button,
  EnumButtonStyle,
  Icon,
  TextField,
} from "@amplication/design-system";
import React, { useCallback, useState } from "react";

import "./CreateServiceRepository.scss";

import "../CreateServiceWizard.scss";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { WizardStepProps } from "./interfaces";
import { ImageLabelDescriptionSelector } from "./ImageLabelDescriptionSelector";

const CreateServiceRepository: React.FC<WizardStepProps> = ({
  moduleClass,
  formik,
}) => {
  const handleDatabaseSelect = useCallback((database: string) => {
    formik.handleChange({ target: { name: "structureType", value: database } });
  }, []);

  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header="Are you using a monorepo or polyrepo?"
          text={`If you are using a monorepo, you can select the folder where you want to save the code of the service. “apps”, “packages”, “ee/packages” all are valid. 
          
          Otherwise, Amplication will push the code to the root of the repo in separate folders for the server and the admin-ui.
          `}
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <div className={`${moduleClass}__repo_wrapper`}>
          <div className={`${moduleClass}__repository_box`}>
            <div className={`${moduleClass}__repository_options`}>
              <ImageLabelDescriptionSelector
                name="monorepo"
                icon=""
                label="Monorepo"
                description="Generate the service into a folder next to other services in the repository"
                onClick={handleDatabaseSelect}
                currentValue={formik.values.structureType}
              />
              <ImageLabelDescriptionSelector
                name="polyrepo"
                icon=""
                label="Polyrepo"
                description="Generate the services into the root of the repository"
                onClick={handleDatabaseSelect}
                currentValue={formik.values.structureType}
              />
            </div>
            <div className={`${moduleClass}__repository_base_dir`}>
              <TextField name="baseDirectory" label="Base directory" />
            </div>
          </div>
          <hr className={`${moduleClass}__repo_hr`}></hr>
          <div className={`${moduleClass}__monorepo`}>
            <div className={`${moduleClass}__monorepo_title`}>
              Your project will look like this:
            </div>
            {formik.values.structureType === "monorepo" ? (
              <div className={`${moduleClass}__monorepo_example`}>
                <div className={`${moduleClass}__monorepo_example_app`}>
                  <Icon icon={"folder"}></Icon>
                  apps
                </div>
                <div className={`${moduleClass}__monorepo_example_tree`}>
                  <hr className={`${moduleClass}__monorepo_hr`}></hr>
                  <div
                    className={`${moduleClass}__monorepo_example_tree_folders`}
                  >
                    <div className={`${moduleClass}__monorepo_box_folder`}>
                      <Icon icon={"folder"}></Icon>
                      example-service
                    </div>
                    <div className={`${moduleClass}__monorepo_box_folder`}>
                      <Icon icon={"folder"}></Icon>
                      example-service-admin
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${moduleClass}__monorepo_example`}>
                <div
                  className={`${moduleClass}__monorepo_example_tree_folders`}
                >
                  <div className={`${moduleClass}__monorepo_box_folder`}>
                    <Icon icon={"folder"}></Icon>
                    example-service
                  </div>
                  <div className={`${moduleClass}__monorepo_box_folder`}>
                    <Icon icon={"folder"}></Icon>
                    example-service-admin
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateServiceRepository;
