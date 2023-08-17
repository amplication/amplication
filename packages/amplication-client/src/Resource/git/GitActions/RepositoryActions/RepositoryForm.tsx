import { Formik } from "formik";
import { omit } from "lodash";
import { useMemo } from "react";
import { DisplayNameField } from "../../../../Components/DisplayNameField";
import { Form } from "../../../../Components/Form";
import * as models from "../../../../models";

import { useStiggContext } from "@stigg/react-sdk";
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

const TOOLTIP_DIRECTION = "n";
const DEMO_REPO_TOOLTIP =
  "Take Amplication for a test drive with a preview repository on our GitHub account. You can later connect to your own repository.";

export const INITIAL_VALUES: Partial<models.GitRepository> = {
  baseBranchName: "",
};

const CLASS_NAME = "auth-with-git";

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
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
    >
      <Form childrenAsBlocks>
        <FormikAutoSave debounceMS={1000} />

        <DisplayNameField
          helpText="Leave this field empty to use the default branch of the repository"
          labelType="normal"
          disabled={!canChangeGitBaseBranch.hasAccess}
          name="baseBranchName"
          label="Base Branch"
          minLength={1}
        />
      </Form>
    </Formik>
  );
};

export default RepositoryForm;
