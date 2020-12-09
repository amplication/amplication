import React, { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import { SelectFieldProps, SelectField } from "@amplication/design-system";

type TPages = {
  blocks: [
    {
      id: string;
      displayName: string;
    }
  ];
};

type Props = Omit<SelectFieldProps, "options"> & {
  applicationId: string;
  //none: null;
};

const PageSelectField = (props: Props) => {
  const { applicationId } = props;

  const { data: pageList } = useQuery<TPages>(GET_PAGES, {
    variables: {
      appId: applicationId,
    },
  });

  const noneOption = { value: "", label: "None" };

  const pageLisOptions = useMemo(() => {
    const returnList = pageList
      ? pageList.blocks.map((page) => ({
          value: page.id || "",
          label: page.displayName,
        }))
      : [];
    returnList.push(noneOption);
    return returnList;
  }, [pageList, noneOption]);

  return <SelectField {...props} options={pageLisOptions} />;
};

export default PageSelectField;

export const GET_PAGES = gql`
  query getPages($appId: String!) {
    blocks(
      where: {
        app: { id: $appId }
        blockType: { in: [CanvasPage, EntityPage] }
      }
      orderBy: { displayName: Asc }
    ) {
      id
      displayName
    }
  }
`;
