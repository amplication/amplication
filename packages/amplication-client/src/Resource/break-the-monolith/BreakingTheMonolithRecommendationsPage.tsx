import React from "react";
import { useFinalizeBreakServiceIntoMicroservices } from "./hooks/useFinalizeBreakServiceIntoMicroservices";
import { useParams } from "react-router-dom";

const BreakingTheMonolithRecommendationsPage: React.FC = () => {
  const { userActionId } = useParams<{ userActionId: string }>();
  const {
    data: breakTheMonolithResult,
    loading,
    error,
  } = useFinalizeBreakServiceIntoMicroservices(userActionId);

  if (
    loading ||
    !breakTheMonolithResult.finalizeBreakServiceIntoMicroservices.data
  )
    return <p>Loading...</p>;
  if (error) return <p>Error: {error.message} </p>;
  console.log("breakTheMonolithResult", breakTheMonolithResult);
  return <>BreakingTheMonolithRecommendationsPage</>;
};

export default BreakingTheMonolithRecommendationsPage;
