import { Entity } from "../../types";
import { Module, readFile } from "../../util/module";

export async function createEntity(entity: Entity): Promise<Module> {
  return {
    path: `admin/src/${entity.name}.tsx`,
    code: `
    import React from "react";
    
    export const ${entity.name} = () => (
        <>
            <h1>${entity.name}</h1>
        </>
    )
    `,
  };
}
