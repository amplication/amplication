import { PanelCollapsible } from "@amplication/ui/design-system";
import { Icon } from "libs/ui/design-system/src/lib/components/Icon/Icon";
import { useState } from "react";

const CLASS_NAME = "catalog";

type CatalogProps = {
  name: string;
  changelog: string;
};

export const DSGCatalog: React.FC<CatalogProps> = ({ name, changelog }) => {
  const [open, setOpen] = useState(false);

  const handleOnCLick = () => {
    setOpen(!open);
  };

  return (
    <div className={CLASS_NAME}>
      <PanelCollapsible headerContent={name}>
        <div className={`${CLASS_NAME}__separator`}></div>
        <div className={`${CLASS_NAME}__changelog`}>{changelog}</div>
      </PanelCollapsible>
    </div>
  );
};
