// 2020-11-24 Script to update deploy step name on ActionStep

import { PrismaClient, EnumDataType } from '@prisma/client';

const EXISTING_STEP_NAME = 'Deploy app';
const NEW_STEP_NAME = 'DEPLOY_APP';

async function main() {
  const client = new PrismaClient();
  await client.actionStep.updateMany({
    where: {
      name: EXISTING_STEP_NAME
    },
    data: {
      name: NEW_STEP_NAME
    }
  });
  await client.$disconnect();
}

main().catch(console.error);

// Execute from bash
// $ POSTGRESQL_URL=postgres://[user]:[password]@127.0.0.1:5432/app-database npx ts-node rename-deploy-step-name.ts
