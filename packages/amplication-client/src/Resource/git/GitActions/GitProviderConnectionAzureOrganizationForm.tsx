import {
  Button,
  EnumButtonStyle,
  FlexItem,
  Form,
  TextField,
  Text,
  EnumTextStyle,
} from "@amplication/ui/design-system";
import { Formik } from "formik";

type AzureOrganizationType = {
  organization: string;
};

type Props = {
  onSubmit: (values: AzureOrganizationType) => void;
};

export const INITIAL_VALUES: AzureOrganizationType = {
  organization: "",
};

const CLASS_NAME = "git-provider-connection__azure-organization-form";

const GitProviderConnectionAzureOrganizationForm = ({ onSubmit }: Props) => {
  return (
    <>
      <Formik
        initialValues={INITIAL_VALUES}
        enableReinitialize
        onSubmit={onSubmit}
      >
        <Form childrenAsBlocks>
          <img
            className={`${CLASS_NAME}__logo`}
            src={`../../../../assets/images/azuredevops.svg`}
            alt=""
          />
          <Text textStyle={EnumTextStyle.Description}>
            In case you are using multiple organizations in Azure DevOps, please
            provide the organization name you would like to connect to.
            <br />
            You can leave this field empty if you are using a single
            organization.
          </Text>
          <TextField name="organization" label="Organization Name" />
          <div>
            <FlexItem
              end={
                <Button type="submit" buttonStyle={EnumButtonStyle.Primary}>
                  Connect
                </Button>
              }
            ></FlexItem>
          </div>
        </Form>
      </Formik>
    </>
  );
};

export default GitProviderConnectionAzureOrganizationForm;
