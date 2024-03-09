import { List } from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import * as models from "../models";
import ModuleDtoEnumMember from "./ModuleDtoEnumMember";
import NewModuleDtoEnumMember from "./NewModuleDtoEnumMember";

type Props = {
  moduleDto: models.ModuleDto;
  onEnumMemberDelete?: (member: models.ModuleDtoEnumMember) => void;
  onEnumMemberAdd?: (member: models.ModuleDto) => void;
};
const ModuleDtoEnumMemberList = React.memo(
  ({ moduleDto, onEnumMemberDelete, onEnumMemberAdd }: Props) => {
    const onDtoEnumMemberChanged = useCallback(() => {
      onEnumMemberAdd && onEnumMemberAdd(moduleDto);
    }, [moduleDto, onEnumMemberAdd]);

    return (
      <>
        <List
          headerContent={
            <NewModuleDtoEnumMember
              moduleDto={moduleDto}
              onEnumMemberAdd={onEnumMemberAdd}
            />
          }
        >
          {moduleDto?.members?.map((member, index) => (
            <ModuleDtoEnumMember
              key={index}
              moduleDto={moduleDto}
              moduleDtoEnumMember={member}
              onEnumMemberChanged={onDtoEnumMemberChanged}
              onEnumMemberDelete={onEnumMemberDelete}
            />
          ))}
        </List>
      </>
    );
  }
);

export default ModuleDtoEnumMemberList;
