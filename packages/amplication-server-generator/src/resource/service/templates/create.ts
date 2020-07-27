declare interface DATA {}

class CreateMixin {
  // @ts-ignore
  prisma: {
    DELEGATE: {
      create(args: ARGS): Promise<ENTITY>;
    };
  };
  create(args: ARGS): Promise<ENTITY> {
    return this.prisma.DELEGATE.create(args);
  }
}
