import { ConfirmationDialog, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import useServiceTemplate from "../ServiceTemplate/hooks/useServiceTemplate";
import { formatError } from "../util/error";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";

const CONFIRM_BUTTON = { label: "Create" };
const DISMISS_BUTTON = { label: "Dismiss" };

type Props = {
  resource: models.Resource;
  onCreate?: (template: models.Resource) => void;
};

export const CreateTemplateFromResourceButton = ({
  resource,
  onCreate,
}: Props) => {
  const history = useHistory();
  const { currentProject } = useAppContext();

  const { baseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  const onTemplateCreated = useCallback(
    (template: models.Resource) => {
      onCreate && onCreate(template);
      history.push(`${baseUrl}/${template.id}`);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
    },
    [baseUrl, history, onCreate]
  );

  const { createTemplateFromResource, errorCreateTemplateFromResource } =
    useServiceTemplate(currentProject, onTemplateCreated);

  const [confirmCreate, setConfirmCreate] = useState<boolean>(false);

  const handleDismissCreate = useCallback(() => {
    setConfirmCreate(false);
  }, [setConfirmCreate]);

  const handleCreate = useCallback(
    (event) => {
      event.stopPropagation();
      setConfirmCreate(true);
    },
    [setConfirmCreate]
  );

  const handleConfirmCreate = useCallback(() => {
    createTemplateFromResource(resource.id);
  }, [createTemplateFromResource, resource?.id]);

  const errorMessage =
    errorCreateTemplateFromResource &&
    formatError(errorCreateTemplateFromResource);

  return (
    <>
      <ConfirmationDialog
        isOpen={confirmCreate}
        title={`Create Template from Resource`}
        confirmButton={CONFIRM_BUTTON}
        dismissButton={DISMISS_BUTTON}
        message={
          <div>
            This action will create a new template based on the settings of this
            resource?
          </div>
        }
        onConfirm={handleConfirmCreate}
        onDismiss={handleDismissCreate}
      />

      <div>
        <Button buttonStyle={EnumButtonStyle.Outline} onClick={handleCreate}>
          Create Template from Resource
        </Button>
      </div>
      <Snackbar open={Boolean(errorMessage)} message={errorMessage} />
    </>
  );
};
