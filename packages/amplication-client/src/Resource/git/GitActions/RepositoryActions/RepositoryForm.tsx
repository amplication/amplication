import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { DisplayNameField } from "../../../../Components/DisplayNameField";
import * as models from "../../../../models";

import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumTextStyle,
  FlexItem,
  Text,
  Form,
} from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import FormikAutoSave from "../../../../util/formikAutoSave";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../../../../Components/FeatureIndicatorContainer";
import { FeatureIndicator } from "../../../../Components/FeatureIndicator";

type Props = {
  onSubmit: (values: models.GitRepository) => void;
  defaultValues?: models.GitRepository;
};

const NON_INPUT_GRAPHQL_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "__typename",
  "gitOrganization",
  "groupName",
  "name",
];

export const INITIAL_VALUES: Partial<models.GitRepository> = {
  baseBranchName: "",
};

const RepositoryForm = ({ onSubmit, defaultValues }: Props) => {
  const initialValues = useMemo(() => {
    const sanitizedDefaultValues = omit(
      defaultValues,
      NON_INPUT_GRAPHQL_PROPERTIES
    );
    return {
      ...INITIAL_VALUES,
      ...sanitizedDefaultValues,
    } as models.GitRepository;
  }, [defaultValues]);

  return (
    <FeatureIndicatorContainer
      featureId={BillingFeature.ChangeGitBaseBranch}
      entitlementType={EntitlementType.Boolean}
      showTooltip={false}
      render={({ disabled, icon }) => (
        <>
          <FlexItem
            margin={EnumFlexItemMargin.Both}
            gap={EnumGapSize.Small}
            direction={EnumFlexDirection.Column}
          >
            <FlexItem>
              <Text textStyle={EnumTextStyle.H4}>Git Base Branch</Text>
              <FeatureIndicator
                featureName={BillingFeature.ChangeGitBaseBranch}
                icon={icon}
              />
            </FlexItem>
            <Text textStyle={EnumTextStyle.Description}>
              Override the default base branch used for the Pull Request with
              the generated code
            </Text>
          </FlexItem>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={onSubmit}
          >
            <Form childrenAsBlocks>
              <FormikAutoSave debounceMS={1000} />

              <FlexItem>
                <DisplayNameField
                  labelType="normal"
                  disabled={disabled}
                  name="baseBranchName"
                  label="Base Branch"
                  inputToolTip={{
                    content: (
                      <span>
                        Leave this field empty to use the default branch of the
                        repository
                      </span>
                    ),
                  }}
                  minLength={1}
                />
              </FlexItem>
            </Form>
          </Formik>
        </>
      )}
    />
  );
};

export default RepositoryForm;
