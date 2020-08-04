import {
  createDataService,
  Module,
  Entity,
} from "amplication-data-service-generator";

export async function generate(entities: Entity[]): Promise<Module[]> {
  const modules = await createDataService(entities);
  return modules;
}
