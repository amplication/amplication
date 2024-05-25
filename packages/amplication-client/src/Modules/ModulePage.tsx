import { match } from "react-router-dom";
import { AppRouteProps } from "../routes/routesUtil";
import "./Module.scss";
import Module from "./Module";

type Props = AppRouteProps & {
  match: match<{
    resource: string;
    module: string;
  }>;
};

const ModulePage = ({ match }: Props) => {
  return <Module />;
};

export default ModulePage;
