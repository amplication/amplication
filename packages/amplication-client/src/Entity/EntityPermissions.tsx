import React from "react";
import * as models from "../models";

type Props = {
  entityPermissions?: models.EntityPermission[] | null;
  onClick: () => void;
};

function EntityPermissions({ entityPermissions, onClick }: Props) {
  return <div onClick={onClick}>{JSON.stringify(entityPermissions)}</div>;
  /**todo:complete display */
}

export default EntityPermissions;
