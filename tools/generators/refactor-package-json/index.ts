import { readJson, Tree } from '@nrwl/devkit';
import * as fse from 'fs-extra';

export default async function (tree: Tree, schema: any) {

	const dirs = await fse.readdir(`packages`, { withFileTypes: false });

	for (let dir of dirs) {
		console.log(dir);
		const packageJsonPath = `packages/${dir}/package.json`;

		const packageJSON = readJson(tree, packageJsonPath);
		const rootPackageJSON = readJson(tree, 'package.json');

		if (packageJSON.dependencies) {
			for (let [key, val] of Object.entries(packageJSON.dependencies)) {
				if (rootPackageJSON.dependencies[key]) {
					const rootVersion = rootPackageJSON.dependencies[key];
					const newVersion = val;
					if (rootVersion !== newVersion) {
						console.warn(`[dependency] root package.json has dependency ${key} with
version ${rootVersion}, subpackage ${dir} has version ${val}\n`);
					}
				}
				rootPackageJSON.dependencies[key] = val
			}
		}
		if (packageJSON.devDependencies) {
			for (let [key, val] of Object.entries(packageJSON.devDependencies)) {
				if (rootPackageJSON.devDependencies[key]) {
					const rootVersion = rootPackageJSON.devDependencies[key];
					const newVersion = val;
					if (rootVersion !== newVersion) {
						console.warn(`[devDependencies] root package.json has devDependencies ${key} with
version ${rootVersion}, subpackage ${dir} has version ${val}\n`);
					}
				}
				rootPackageJSON.devDependencies[key] = val
			}
		}

		tree.write('package.json', JSON.stringify(rootPackageJSON, null, 2));
	}


}
