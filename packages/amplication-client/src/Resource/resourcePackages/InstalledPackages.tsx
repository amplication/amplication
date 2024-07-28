import { List, Snackbar, TabContentTitle } from "@amplication/ui/design-system";
import React from "react";
import { match } from "react-router-dom";
import { AppRouteProps } from "../../routes/routesUtil";
import { formatError } from "../../util/error";
import { EnumImages } from "../../Components/SvgThemeImage";
import { EmptyState } from "../../Components/EmptyState";
import usePackage from "../hooks/usePackage";
import { PackageListItem } from "./PackageListItem";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
  }>;
};

const TITLE = "Installed Packages";
const SUB_TITLE = "Manage your installed packages";

const InstalledPackages: React.FC<Props> = ({ match }: Props) => {
  const { findPackagesData, findPackagesError } = usePackage();

  const errorMessage = formatError(findPackagesError);

  return findPackagesData?.packageList?.length > 0 ? (
    <div>
      <TabContentTitle title={TITLE} subTitle={SUB_TITLE} />
      <List>
        {findPackagesData.packageList?.length > 0 &&
          findPackagesData.packageList.map((currentPackage) => (
            <PackageListItem packageItem={currentPackage} />
          ))}
      </List>
      <Snackbar open={Boolean(findPackagesError)} message={errorMessage} />
    </div>
  ) : (
    <EmptyState
      image={EnumImages.PluginInstallationEmpty}
      message="There are no packages to show"
    />
  );
};

export default InstalledPackages;
