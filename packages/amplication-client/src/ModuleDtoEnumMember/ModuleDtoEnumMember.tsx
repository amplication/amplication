import { ListItem, Snackbar } from "@amplication/ui/design-system";
import { useCallback, useContext, useState } from "react";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { DeleteModuleDtoEnumMember } from "./DeleteModuleDtoEnumMember";
import ModuleDtoEnumMemberForm from "./ModuleDtoEnumMemberForm";
import useModuleDtoEnumMember from "./hooks/useModuleDtoEnumMember";

type Props = {
  moduleDto: models.ModuleDto;
  moduleDtoEnumMember: models.ModuleDtoEnumMember;
  onEnumMemberDelete?: (enumMember: models.ModuleDtoEnumMember) => void;
  onEnumMemberChanged?: (enumMember: models.ModuleDtoEnumMember) => void;
};

const ModuleDtoEnumMember = ({
  moduleDto,
  moduleDtoEnumMember,
  onEnumMemberDelete,
  onEnumMemberChanged,
}: Props) => {
  const { addEntity } = useContext(AppContext);
  const [originalName, setOriginalName] = useState<string>(
    moduleDtoEnumMember.name
  );

  const enumMemberId = moduleDtoEnumMember.name;

  const { updateModuleDtoEnumMember, updateModuleDtoEnumMemberError } =
    useModuleDtoEnumMember();

  const handleSubmit = useCallback(
    (data) => {
      updateModuleDtoEnumMember({
        variables: {
          where: {
            enumMemberName: originalName,
            moduleDto: {
              id: moduleDto.id,
            },
          },
          data: {
            ...data,
          },
        },
        onCompleted: () => {
          addEntity(enumMemberId);
          setOriginalName(data.name);
          onEnumMemberChanged && onEnumMemberChanged(moduleDtoEnumMember);
        },
      }).catch(console.error);
    },
    [
      updateModuleDtoEnumMember,
      addEntity,
      enumMemberId,
      originalName,
      moduleDto,
      onEnumMemberChanged,
      moduleDtoEnumMember,
      setOriginalName,
    ]
  );

  const hasError = Boolean(updateModuleDtoEnumMemberError);

  const errorMessage = formatError(updateModuleDtoEnumMemberError);

  const isCustomDto = true;

  return (
    <>
      <>
        <ListItem
          end={
            <DeleteModuleDtoEnumMember
              moduleDto={moduleDto}
              moduleDtoEnumMember={moduleDtoEnumMember}
              onEnumMemberDelete={onEnumMemberDelete}
            />
          }
        >
          <ModuleDtoEnumMemberForm
            moduleDto={moduleDto}
            isCustomDto={isCustomDto}
            onSubmit={handleSubmit}
            defaultValues={moduleDtoEnumMember}
            onEnumMemberDelete={onEnumMemberDelete}
          />
        </ListItem>
      </>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ModuleDtoEnumMember;
