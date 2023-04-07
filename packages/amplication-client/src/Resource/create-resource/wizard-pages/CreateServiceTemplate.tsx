import React, { useCallback } from "react";
import "../CreateServiceWizard.scss";

import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { LabelDescriptionSelector } from "./LabelDescriptionSelector";
import { EnumTemplateType, WizardStepProps } from "./interfaces";

const CreateServiceTemplate: React.FC<WizardStepProps> = ({
  formik,
  trackWizardPageEvent,
}) => {
  const handleTemplateSelect = useCallback(
    (templateType: EnumTemplateType) => {
      formik.setValues(
        {
          ...formik.values,
          templateType: templateType,
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
          header="Add entities to your data model?"
          text={`Start from an empty schema or use one of our templates to jump-start your DB with a pre-defined set of entities and fields based on popular use cases.
        `}
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <Layout.SelectorWrapper>
          <LabelDescriptionSelector
            name="empty"
            label="Empty"
            subDescription="(Start from scratch)"
            customClassName="label-description-selector__template"
            description="Manually define your own entities and fields"
            onClick={handleTemplateSelect}
            currentValue={formik.values.templateType}
          />
          <LabelDescriptionSelector
            name="orderManagement"
            subDescription="Order Management"
            customClassName="label-description-selector__template"
            label="Use a Template"
            description=""
            onClick={handleTemplateSelect}
            currentValue={formik.values.templateType}
          >
            <div className="label-description-selector__template_description">
              Pre-defined set of entities and fields <br />
              Address, Orders, User
            </div>
          </LabelDescriptionSelector>
        </Layout.SelectorWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateServiceTemplate;
