import { PrismaClient } from "../src/prisma";

async function main() {
  const prisma = new PrismaClient();
  const gitOrganizations = await prisma.gitOrganization.findMany({
    where: { providerProperties: {} },
  });

  for (const gitOrg of gitOrganizations) {
    const updatedProviderProps = { installationId: gitOrg.installationId };

    await prisma.gitOrganization.update({
      where: { id: gitOrg.id },
      data: { providerProperties: updatedProviderProps },
    });
  }
}

main().catch(console.error);
