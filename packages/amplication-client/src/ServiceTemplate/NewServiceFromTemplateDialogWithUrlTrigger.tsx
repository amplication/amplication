import { Dialog } from "@amplication/ui/design-system";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { useUrlQuery } from "../util/useUrlQuery";
import NewServiceFromTemplate from "./NewServiceFromTemplate";
import { EnumDialogStyle } from "@amplication/ui/design-system/components/Dialog/Dialog";

export const CREATE_SERVICE_FROM_TEMPLATE_TRIGGER_URL =
  "create-service-from-template";

const NewServiceFromTemplateDialogWithUrlTrigger = () => {
  const history = useHistory();
  const { currentProject } = useAppContext();

  const [createFromTemplateIsOpen, setCreateFromTemplateIsOpen] =
    useState(false);

  const query = useUrlQuery();

  const handleDismissCreateFromTemplate = useCallback(() => {
    setCreateFromTemplateIsOpen(false);
    query.delete(CREATE_SERVICE_FROM_TEMPLATE_TRIGGER_URL);

    history.replace({
      search: query.toString(),
    });
  }, [history, query]);

  useEffect(() => {
    if (query.has(CREATE_SERVICE_FROM_TEMPLATE_TRIGGER_URL)) {
      setCreateFromTemplateIsOpen(true);
    }
  }, [query]);

  return (
    <Dialog
      dialogStyle={EnumDialogStyle.Success}
      isOpen={createFromTemplateIsOpen}
      onDismiss={handleDismissCreateFromTemplate}
      title="Create Service from template"
    >
      <NewServiceFromTemplate projectId={currentProject?.id} />
    </Dialog>
  );
};

export default NewServiceFromTemplateDialogWithUrlTrigger;
