interface DATA {}
interface ENTITY {}

class CreateMixin {
  // @ts-ignore
  prisma: {
    DELEGATE: {
      create(args: { data: DATA }): Promise<ENTITY>;
    };
  };
  create({ data }: { data: DATA }): Promise<ENTITY> {
    return this.prisma.DELEGATE.create({ data });
  }
}
