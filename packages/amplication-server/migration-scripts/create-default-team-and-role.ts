import { PrismaClient, Workspace } from "../prisma/generated-prisma-client";

const client = new PrismaClient();

async function main() {
  const workspaces = await client.workspace.findMany();

  console.log(workspaces.length);
  let index = 1;

  const chunks = chunkArrayInGroups(workspaces, 500);

  for (const chunk of chunks) {
    console.log(index++);
    await migrateChunk(chunk);
  }

  async function migrateChunk(chunk: Workspace[]) {
    try {
      const promises = chunk.map(async (workspace) => {
        try {
          const users = await client.user.findMany({
            where: {
              workspaceId: workspace.id,
            },
          });

          console.log(`Workspace: ${workspace.id}, Users: ${users.length}`);
          //return;

          const role = await client.role.create({
            data: {
              name: "Admins",
              key: "ADMINS",
              description: "Can access and manage all resources",
              permissions: ["*"],
              workspace: {
                connect: {
                  id: workspace.id,
                },
              },
            },
          });

          const team = await client.team.create({
            data: {
              name: "Admins",
              description: "Admins team",
              color: "#ACD371",
              members: {
                connect: [
                  ...users.map((user) => ({
                    id: user.id,
                  })),
                ],
              },
              roles: {
                connect: {
                  id: role.id,
                },
              },
              workspace: {
                connect: {
                  id: workspace.id,
                },
              },
            },
          });
        } catch (error) {
          console.log(
            `Failed to create default team and role for workspace: ${workspace.id},  error: ${error} `
          );
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.log(`Failed to run migrateChunk, error: ${error}`);
    }
  }

  await client.$disconnect();
}

function chunkArrayInGroups(arr, size) {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

main().catch(console.error);

// Execute from bash
// $ POSTGRESQL_URL=postgresql://admin:admin@localhost:5432/amplication npx ts-node create-default-team-and-role.ts
