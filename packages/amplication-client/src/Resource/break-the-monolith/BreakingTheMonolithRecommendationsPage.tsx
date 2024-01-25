import React, { useContext, useEffect, useState } from "react";
import { useBtmService } from "./hooks/useBtmService";
import { AppContext } from "../../context/appContext";

const BreakingTheMonolithRecommendationsPage: React.FC = () => {
  const { currentResource } = useContext(AppContext);
  const [userActionId, setUserActionId] = useState<string>(null);
  const { triggerBreakTheMonolith, btmResult } = useBtmService({
    userActionId,
    resourceId: currentResource?.id,
  });

  useEffect(() => {
    triggerBreakTheMonolith()
      .then((res) => {
        setUserActionId(res.data.triggerBreakServiceIntoMicroservices.id);
      })
      .catch((err) => console.error(err));
  }, [triggerBreakTheMonolith]);

  console.log("btmResult", btmResult);
  return <>BreakingTheMonolithRecommendationsPage</>;
};

export default BreakingTheMonolithRecommendationsPage;
