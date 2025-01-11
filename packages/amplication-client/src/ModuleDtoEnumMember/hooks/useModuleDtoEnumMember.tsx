import { useMutation } from "@apollo/client";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import {
  CREATE_MODULE_DTO_ENUM_MEMBER,
  DELETE_MODULE_DTO_ENUM_MEMBER,
  UPDATE_MODULE_DTO_ENUM_MEMBER,
} from "../queries/moduleDtosEnumMemberQueries";

type TDeleteEnumMemberData = {
  deleteModuleDtoEnumMember: models.ModuleDtoEnumMember;
};

type TCreateEnumMemberData = {
  createModuleDtoEnumMember: models.ModuleDtoEnumMember;
};

type TUpdateEnumMemberData = {
  updateModuleDtoEnumMember: models.ModuleDtoEnumMember;
};

const useModuleDto = () => {
  const { addBlock, addEntity } = useContext(AppContext);

  const [
    deleteModuleDtoEnumMember,
    {
      error: deleteModuleDtoEnumMemberError,
      loading: deleteModuleDtoEnumMemberLoading,
    },
  ] = useMutation<TDeleteEnumMemberData>(DELETE_MODULE_DTO_ENUM_MEMBER, {
    onCompleted: (data) => {
      addBlock(data.deleteModuleDtoEnumMember.name);
    },
  });

  const [
    createModuleDtoEnumMember,
    {
      data: createModuleDtoEnumMemberData,
      error: createModuleDtoEnumMemberError,
      loading: createModuleDtoEnumMemberLoading,
    },
  ] = useMutation<TCreateEnumMemberData>(CREATE_MODULE_DTO_ENUM_MEMBER, {
    onCompleted: (data) => {
      addBlock(data.createModuleDtoEnumMember.name);
    },
  });

  const [
    updateModuleDtoEnumMember,
    {
      error: updateModuleDtoEnumMemberError,
      loading: updateModuleDtoEnumMemberLoading,
    },
  ] = useMutation<TUpdateEnumMemberData>(UPDATE_MODULE_DTO_ENUM_MEMBER, {
    onCompleted: (data) => {
      addEntity(data.updateModuleDtoEnumMember.name);
    },
  });

  return {
    createModuleDtoEnumMember,
    createModuleDtoEnumMemberData,
    createModuleDtoEnumMemberError,
    createModuleDtoEnumMemberLoading,
    updateModuleDtoEnumMember,
    updateModuleDtoEnumMemberError,
    updateModuleDtoEnumMemberLoading,
    deleteModuleDtoEnumMember,
    deleteModuleDtoEnumMemberError,
    deleteModuleDtoEnumMemberLoading,
  };
};

export default useModuleDto;
