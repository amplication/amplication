import { types } from "recast";
const { builders } = types;

export class EnumBuilder {
  private _ast: types.namedTypes.TSEnumDeclaration;
  constructor(public readonly enumName: string) {
    this._ast = builders.tsEnumDeclaration(builders.identifier(enumName), []);
  }

  createMember(key: string, value?: string): EnumBuilder {
    this._ast.members.push(
      builders.tsEnumMember(
        builders.identifier(key),
        value ? builders.stringLiteral(value) : undefined
      )
    );

    return this;
  }

  readMember(key: string): types.namedTypes.TSEnumMember | undefined {
    return this._ast.members.find(
      (member) => (member.id as types.namedTypes.Identifier).name === key
    );
  }

  updateMember(key: string, value: string): EnumBuilder {
    const member = this._ast.members.find(
      (member) => (member.id as types.namedTypes.Identifier).name === key
    );
    if (!member) {
      throw new Error(`Member ${key} not found`);
    }
    member.initializer = builders.stringLiteral(value);
    return this;
  }

  public get ast(): types.namedTypes.TSEnumDeclaration {
    return this._ast;
  }
}
