// 2020-10-20 Script to remove all fields with data type "Auto Number"

import { PrismaClient, EnumDataType } from '@prisma/client';

async function main() {
  const client = new PrismaClient();
  await client.entityField.deleteMany({
    where: {
      dataType: EnumDataType.AutoNumber
    }
  });
  await client.$disconnect();
}

main().catch(console.error);

// Execute from bash
// $ POSTGRESQL_URL=postgres://[user]:[password]@127.0.0.1:5432/app-database npx ts-node delete-auto-number.ts
