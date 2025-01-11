import React from "react";
import { useAppContext } from "../context/appContext";
import ResourceSettingsForm from "./ResourceSettingsForm";

const ResourceSettingsPage: React.FC = () => {
  const { currentResource } = useAppContext();

  return currentResource ? (
    <ResourceSettingsForm resource={currentResource} />
  ) : (
    <></>
  );
};

export default ResourceSettingsPage;
