import { useHistory } from "react-router-dom";
import { useTriggerBreakServiceIntoMicroservices } from "./hooks/useTriggerBreakServiceIntoMicroservices";

type Props = {
  resourceId: string;
  projectId: string;
  workspaceId: string;
  path: string;
};

export const TriggerBreakTheMonolith: React.FC<Props> = ({
  resourceId,
  projectId,
  workspaceId,
  path,
}) => {
  const history = useHistory();
  const { trigger, loading, error } = useTriggerBreakServiceIntoMicroservices();

  const handleButtonClick = () => {
    trigger(resourceId)
      .then((response) => {
        const userActionId =
          response.data.triggerBreakServiceIntoMicroservices.id;
        history.push(
          `/${workspaceId}/${projectId}/${resourceId}/${path}/${userActionId}`
        );
      })
      .catch((error) => console.error(error));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <button onClick={handleButtonClick}>Break the monolith</button>;
};
