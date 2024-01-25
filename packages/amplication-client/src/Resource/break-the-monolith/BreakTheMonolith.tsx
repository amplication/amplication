import { CircularProgress } from "@amplication/ui/design-system";
import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";
import { useBtmService } from "./hooks/useBtmService";

const BreakTheMonolith: React.FC = () => {
  const { currentResource } = useContext(AppContext);
  const {
    btmResult: data,
    loading,
    error,
  } = useBtmService({
    resourceId: currentResource?.id,
  });

  return (
    <div>
      {loading && <CircularProgress />}
      <div>Status :{data.status}</div>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

export default BreakTheMonolith;
