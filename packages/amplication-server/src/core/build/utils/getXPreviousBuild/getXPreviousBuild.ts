import { Build } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

export const getXPreviousBuild = async (
  x: number,
  prisma: PrismaService,
  appId: string,
  newBuildId: string
): Promise<Build | null> => {
  const oldBuild = (
    await prisma.build.findMany({
      take: x,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      where: { appId: appId, NOT: { id: newBuildId } },
      orderBy: { createdAt: 'desc' }
    })
  )[x - 1];
  return oldBuild || null;
};
