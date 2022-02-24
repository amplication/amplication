import React, { useState } from "react";
import { GitOrganization } from "../../../models";
import SelectMenu from "../SelectMenu/SelectMenu";
import SelectMenuButton from "../SelectMenu/SelectMenuButton";

type Props = {
  gitOrganizations: GitOrganization[];
};

//

export default function ExistingConnections(props: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { gitOrganizations } = props;
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <SelectMenuButton
        organizationName={gitOrganizations[0].name}
        imgSrc={`https://avatars.githubusercontent.com/${gitOrganizations[0].name}`}
        onClick={handleClick}
      />
      <SelectMenu
        anchorEl={anchorEl}
        handleClose={handleClose}
        gitOrganizations={gitOrganizations}
      />
    </div>
  );
}
