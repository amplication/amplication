/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface CreateModule {
  /**
   * the name of the module. for example: System, Customer, Order, Util.
   */
  moduleName: string;
  /**
   * the description of the module.
   */
  moduleDescription: string;
  /**
   * the ID of the resource in which the module is created. If there are multiple resources available in the context, show the user a list of resources to choose from. If there is no resource available, do not use projectId instead
   */
  resourceId: string;
}
