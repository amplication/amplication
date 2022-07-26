import { isInAmplicationIgnore } from './isInAmplicationIgnore';

describe('Testing the logic of isInAmplicationIgnore', () => {
  it('should return false when the expressions array is empty', () => {
    const amplicationIgnoreExpressions: string[] = [];
    const filePath = 'server/src/auth/auth.service.ts';
    const result = isInAmplicationIgnore(
      amplicationIgnoreExpressions,
      filePath
    );
    expect(result).toBe(false);
  });
  describe('Testing with several glob expressions', () => {
    const amplicationIgnoreExpressions: string[] = [
      'server/src/auth/*.service.ts',
      'server/src/auth/*.module.ts',
      'server/src/auth/*.resolver.ts',
      'server/src/auth/*.controller.ts',
      'server/src/dot/**/*',
      'admin-ui/**/*'
    ];
    it('should return true if the filePath is in the glob expressions', () => {
      const filePath = 'server/src/auth/auth.service.ts';
      const result = isInAmplicationIgnore(
        amplicationIgnoreExpressions,
        filePath
      );
      expect(result).toBe(true);
    });
    it('should return false if the filePath is not in the glob expressions', () => {
      const filePath = 'server/src/auth/auth.ts';
      const result = isInAmplicationIgnore(
        amplicationIgnoreExpressions,
        filePath
      );
      expect(result).toBe(false);
    });
    it("should return true for dot files if the glob expression is '**/*'", () => {
      const filePath = 'server/src/dot/.gitignore';
      const result = isInAmplicationIgnore(
        amplicationIgnoreExpressions,
        filePath
      );
      expect(result).toBe(true);
    });
    it("should return true for every file in the admin-ui folder if the glob expression is 'admin-ui/**/*'", () => {
      const filePath = 'admin-ui/src/app/app.module.ts';
      const result = isInAmplicationIgnore(
        amplicationIgnoreExpressions,
        filePath
      );
      expect(result).toBe(true);
    });
  });
});
