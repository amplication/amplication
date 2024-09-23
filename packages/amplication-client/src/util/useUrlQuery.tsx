import { useLocation } from "react-router-dom";

export const useUrlQuery = () => {
  return new URLSearchParams(useLocation().search);
};
