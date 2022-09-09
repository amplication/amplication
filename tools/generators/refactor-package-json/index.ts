import { readJson, Tree } from '@nrwl/devkit';
import * as fse from 'fs-extra';

export default async function (tree: Tree, schema: any) {
	const rootPackageJSON = readJson(tree, 'package.json');
	const dirs = await fse.readdir(`packages`, { withFileTypes: false, encoding: 'utf8' });

	for (let dir of dirs) {
		console.log(dir);

		if (dir === 'test') {
			continue
		}

		const packageJsonPath = `packages/${dir}/package.json`;

		const packageJSON = readJson(tree, packageJsonPath);

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

		//delete packageJSON.dependencies;
		delete packageJSON.dependencies;
		delete packageJSON.devDependencies;
		tree.write(packageJsonPath, JSON.stringify(packageJSON, null, 2));

	}

	for (let dir of dirs) {
		delete rootPackageJSON.dependencies['@amplication/' + dir.replace(/^amplication-/, '')];
		delete rootPackageJSON.devDependencies['@amplication/' + dir.replace(/^amplication-/, '')];
	}

	for (let dependency of Object.keys(rootPackageJSON.devDependencies)) {
		if (rootPackageJSON.dependencies[dependency]) {
			delete rootPackageJSON.dependencies[dependency];
		}
	}

	//enforce typescript version
	rootPackageJSON.devDependencies.typescript = '4.7.4';

	tree.write('package.json', JSON.stringify(rootPackageJSON, null, 2));

}
