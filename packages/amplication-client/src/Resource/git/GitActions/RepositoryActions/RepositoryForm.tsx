import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { DisplayNameField } from "../../../../Components/DisplayNameField";
import { Form } from "../../../../Components/Form";
import * as models from "../../../../models";

import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { useStiggContext } from "@stigg/react-sdk";
import { LockedFeatureIndicator } from "../../../../Components/LockedFeatureIndicator";
import { BillingFeature } from "../../../../util/BillingFeature";
import FormikAutoSave from "../../../../util/formikAutoSave";

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

  const { stigg } = useStiggContext();
  const canChangeGitBaseBranch = stigg.getBooleanEntitlement({
    featureId: BillingFeature.ChangeGitBaseBranch,
  });

  return (
    <>
      <FlexItem
        margin={EnumFlexItemMargin.Both}
        gap={EnumGapSize.Small}
        direction={EnumFlexDirection.Column}
      >
        <FlexItem>
          <Text textStyle={EnumTextStyle.H4}>Git Base Branch</Text>

          {!canChangeGitBaseBranch.hasAccess && (
            <LockedFeatureIndicator
              featureName={BillingFeature.ChangeGitBaseBranch}
            />
          )}
        </FlexItem>
        <Text textStyle={EnumTextStyle.Description}>
          Override the default base branch used for the Pull Request with the
          generated code
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
              disabled={!canChangeGitBaseBranch.hasAccess}
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
  );
};

export default RepositoryForm;
