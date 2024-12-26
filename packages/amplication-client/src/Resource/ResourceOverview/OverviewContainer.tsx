import { EnumResourceType } from "@amplication/code-gen-types";
import { useAppContext } from "../../context/appContext";
import ComponentOverview from "./ComponentOverview";
import ResourceOverview from "./ResourceOverview";

const OverviewContainer = () => {
  const { currentResource } = useAppContext();

  const getOverviewComponent = () => {
    switch (currentResource?.resourceType) {
      case EnumResourceType.Component:
        return <ComponentOverview />;

      default:
        return <ResourceOverview />;
    }
  };

  const overviewComponent = getOverviewComponent();

  return overviewComponent;
};

export default OverviewContainer;
