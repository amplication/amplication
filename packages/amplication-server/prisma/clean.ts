/* eslint-disable @typescript-eslint/no-use-before-define */

import { PrismaClient } from '@prisma/client';

if (require.main === module) {
  clean().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

async function clean() {
  console.info('Dropping all tables in the database...');
  const prisma = new PrismaClient();
  const tables = await getTables(prisma);
  const types = await getTypes(prisma);
  await dropTables(prisma, tables);
  await dropTypes(prisma, types);
  console.info('Cleaned database successfully');
  await prisma.$disconnect();
}

async function dropTables(
  prisma: PrismaClient,
  tables: string[]
): Promise<void> {
  for (const table of tables) {
    await prisma.$executeRaw(`DROP TABLE public."${table}" CASCADE;`);
  }
}

async function dropTypes(prisma: PrismaClient, types: string[]) {
  for (const type of types) {
    await prisma.$executeRaw(`DROP TYPE IF EXISTS "${type}" CASCADE;`);
  }
}

async function getTables(prisma: PrismaClient): Promise<string[]> {
  const results: Array<{
    tablename: string;
  }> = await prisma.$queryRaw`SELECT tablename from pg_tables where schemaname = 'public';`;
  return results.map(result => result.tablename);
}

async function getTypes(prisma: PrismaClient): Promise<string[]> {
  const results: Array<{
    typname: string;
  }> = await prisma.$queryRaw`
SELECT t.typname
FROM pg_type t 
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public';
`;
  return results.map(result => result.typname);
}
