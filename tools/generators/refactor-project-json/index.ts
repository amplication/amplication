import { readJson, Tree } from '@nrwl/devkit';
import * as fse from 'fs-extra';

export default async function (tree: Tree, schema: any) {
	const dirs = await fse.readdir(`packages`, { withFileTypes: false, encoding: 'utf8' });

	for (let dir of dirs) {
		console.log(dir);

		if (dir === 'test' || /^amplication/.exec(dir) === null) {
			continue
		}

		const projectJsonPath = `packages/${dir}/project.json`;

		const projectJSON = readJson(tree, projectJsonPath);

		delete projectJSON.targets['ng-packagr-build'];

		tree.delete(`packages/${dir}/ng-package.json`);
		tree.delete(`packages/${dir}/tsconfig.lib.prod.json`);

		const jestConfig = await fse.readFile(`packages/test/jest.config.ts`, { encoding: 'utf8' });
		const newJestConfig = jestConfig.replace(`displayName: 'test'`, `displayName: '${dir}'`)
			.replace(`coverageDirectory: '../../coverage/packages/test'`, `coverageDirectory: '../../coverage/packages/${dir}'`);
		await fse.outputFile( `packages/${dir}/jest.config.ts`, newJestConfig);

		await fse.copyFile(`packages/test/tsconfig.spec.json`, `packages/${dir}/tsconfig.spec.json`);
		tree.write(projectJsonPath, JSON.stringify(projectJSON, null, 2));
	}
}
