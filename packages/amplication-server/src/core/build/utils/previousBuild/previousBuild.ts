import { PrismaService, Build } from "../../../../prisma";

export const previousBuild = async (
  prisma: PrismaService,
  resourceId: string,
  newBuildId: string,
  buildDate: Date
): Promise<Build | null> => {
  const oldBuild = (
    await prisma.build.findMany({
      take: 1,
      skip: 0,
      where: {
        resourceId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NOT: { id: newBuildId },
        createdAt: { lt: buildDate },
      },
      orderBy: { createdAt: "desc" },
    })
  ).shift();
  return oldBuild || null;
};
