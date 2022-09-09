import { readJson, Tree } from '@nrwl/devkit';
import fse from 'fs-extra';

export default async function (tree: Tree, schema: any) {

	const dirs = await fse.readdir(`packages`, { withFileTypes: false });

	for (let dir of dirs) {
		console.log(dir);
	}

	// const packageJsonPath = `packages/${schema.name}/package.json`;
	//
	//
	// const packageJSON = readJson(tree, packageJsonPath);
	// const rootPackageJSON = readJson(tree, 'package.json');
	//
	// if (packageJSON.dependencies) {
	//
	// }
}
