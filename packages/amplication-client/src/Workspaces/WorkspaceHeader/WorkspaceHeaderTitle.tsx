import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { sentenceCase } from "sentence-case";
import { EnumResourceType, Resource } from "../../models";
import { WORK_SPACE_HEADER_CLASS_NAME } from "./WorkspaceHeader";

type Props = {
  resource: Resource;
};

const knownPages = ["commits", "code-view"];

export default function WorkspaceHeaderTitle({ resource }: Props) {
  const location = useLocation();
  const { pathname } = location;
  const lastPathnameParam = pathname.split("/").at(-1);
  if (!lastPathnameParam) {
    throw new Error("Didn't found any pathname params");
  }

  const title = useMemo(() => {
    let generatedTitle = "";
    if (knownPages.some((word) => word === lastPathnameParam)) {
      generatedTitle = sentenceCase(lastPathnameParam);
    } else if (
      resource.resourceType === EnumResourceType.ProjectConfiguration
    ) {
      generatedTitle = "Project configuration";
    } else {
      generatedTitle = resource.name;
    }
    return generatedTitle;
  }, [lastPathnameParam, resource.name, resource.resourceType]);

  return (
    <p
      className={`${WORK_SPACE_HEADER_CLASS_NAME}__breadcrumbs__resource__title`}
    >
      {title}
    </p>
  );
}
