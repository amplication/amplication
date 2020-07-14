// @ts-ignore: Cannot find name 'ENTITY'.
function create(args: ARGS): Promise<ENTITY> {
  // Service class method, this is the service's instance
  // @ts-ignore: 'this' implicitly has type 'any' because it does not have a type annotation.
  return this.prisma.DELEGATE.create(args);
}
