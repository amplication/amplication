import {
  FlexItem,
  Snackbar,
  TabContentTitle,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { match } from "react-router-dom";
import { formatError } from "../../util/error";
import usePackage from "../hooks/usePackage";
import { AppRouteProps } from "../../routes/routesUtil";
import PackageForm from "./PackageForm";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    package: string;
  }>;
};

const Package = ({ match }: Props) => {
  const { package: packageId } = match.params;

  const {
    getPackageData: data,
    getPackageError: error,
    getPackageLoading: loading,
    updatePackage,
    updatePackageError,
  } = usePackage(packageId);

  const handleSubmit = useCallback(
    (data) => {
      const { displayName, summary } = data;
      updatePackage({
        variables: {
          where: {
            id: packageId,
          },
          data: {
            ...data,
            displayName,
            summary,
          },
        },
      }).catch(console.error);
    },
    [packageId, updatePackage]
  );

  const hasError = Boolean(error) || Boolean(updatePackageError);

  const errorMessage = formatError(error) || formatError(updatePackageError);

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.package?.displayName}
          //subTitle={data?.package?.description} todo: do we need this?
        />
      </FlexItem>
      {!loading && (
        <PackageForm onSubmit={handleSubmit} defaultValues={data?.package} />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Package;
