export const updatePath = (path: string, params: { [key: string]: string }) => {
  const pathArr = path.replace("/", "").split("/");
  const unknownPath = "/404";

  return pathArr.reduce((assignedPath: string, pathSec: string) => {
    if (assignedPath === unknownPath) return assignedPath;

    const value = pathSec.replace(
      /:[[a-zA-Z?]+/g,
      (match: string) => params[match.slice(1)] || ""
    );
    if (!value) return (assignedPath = unknownPath);

    assignedPath += `/${value}`;
    return assignedPath;
  }, "");
};
