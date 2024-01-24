import { useMutation } from "@apollo/client";
import { TRIGGER_BREAK_SERVICE_INTO_MICROSERVICES } from "../queries";

export function useTriggerBreakServiceIntoMicroservices() {
  const [triggerMutation, { data, loading, error }] = useMutation(
    TRIGGER_BREAK_SERVICE_INTO_MICROSERVICES
  );

  const trigger = (resourceId: string) => {
    return triggerMutation({ variables: { resourceId } });
  };

  return { trigger, data, loading, error };
}
