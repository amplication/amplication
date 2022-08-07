import * as path from "path"
import * as crypto from "crypto"
import glob = require("glob")
import {Dirent, readdirSync, existsSync, Stats, readFileSync,statSync} from "fs";


const WORKING_DIRECTORY = process.cwd() + "../../../../../.."
const ignore:string[] = ["node_modules/**", "lib/**", "dist/**", "**/*.spec.ts","__tests__/**","__mocks__/**","test/**","tests/**",]
const services:string[] =["ee/packages/amplication-git-pull-service","ee/packages/amplication-git-push-webhook-service","packages/amplication-client",
    "packages/amplication-data-service-generator","packages/amplication-git-pull-request-service",
    "packages/amplication-scheduler","packages/amplication-server","packages/amplication-storage-gateway"]
const packages_root_folders:string[] = ["ee/packages","packages"]
console.log(WORKING_DIRECTORY)

const getPackageNameByPath = (packagePath:string):{path:string,name:string}=> {
    return {
        path: path.dirname(packagePath),
        name: require(packagePath).name
    }
}


const getPackageNameAndDependenciesByPath = (packagePath:string):{path:string,name:string,dependencies:string[]}=> {
    const  packageJson = require(path.join(WORKING_DIRECTORY,packagePath,"package.json"))
    return {
        path: packagePath,
        name: packageJson.name,
        dependencies:  [...new Set(Object.keys(packageJson.dependencies).concat(Object.keys(packageJson.devDependencies)))]
    }
}
const getPackageJsons = (folderPath:string): string[]=>{
    console.log(folderPath)
    return glob.sync('*/package.json',
        {
            ignore,
            cwd: path.join(WORKING_DIRECTORY, folderPath),
            mark: true,
            nodir: false,
            realpath: true,
            nosort: false,
        })
}

const getFiles = (folder:{ path:string, name:string  }):{ name:string, path:string, files:string[] } => {
    return {
        name: folder.name,
        path: folder.path,
        files: glob.sync("**",
            {
                ignore,
                cwd: folder.path,
                mark: true,
                nodir: true,
                // realpath: true,
                absolute:true,
                nosort: false,
            })
    }
}

const getFolderFileStats = (folder:{ name:string, path:string, files:string[] }):{ name:string, path:string, files: { path:string, stats:Stats }[] } => {
    return {
        path: folder.path,
        name: folder.name,
        files: folder.files.map(filepath => {
            return {
                path: filepath,
                stats: statSync(filepath)
            }
        })
    }
}

const getFolderFilesHash = (folder:{ name:string, path:string, files: { path:string, stats:Stats }[]}):
    { name:string,path:string, files: { path:string, hash:string }[]} => {
    return {
        path: folder.path,
        name: folder.name,
        files: folder.files.map(({path,stats}:{ path:string, stats:Stats }) => {
            return {
                path: path,
                hash: hashFileSync(path,stats)
            }
        })
    }
}

const getFolderHash = (folder:{ name:string, path:string, files: { path:string, hash:string }[]}):{  name:string, path:string, hash:string} => {
    return {
        name: folder.name,
        path: folder.path,
        hash: hash(folder.files.map(file=>file.hash).join())
    }
}

const hashFileSync = (path:string, stats:Stats) => {
    const shasum = crypto.createHash('sha1');

    // Use git's header.
    shasum.update('blob ' + stats.size + '\0');

    // Read the file, and hash the results.
    const buffer = readFileSync(path);
    shasum.update(buffer);

    // When the file is done, we have the complete shasum.
    return shasum.digest('hex');
}

const hash = (value:string) => {
    const shasum = crypto.createHash('sha1');
    shasum.update(value);
    return shasum.digest('hex');
}


const pkgs:{  name:string, path:string, hash:string}[] = packages_root_folders
    .flatMap(getPackageJsons)
    .map(getPackageNameByPath)
    .map(getFiles)
    .map(getFolderFileStats)
    .map(getFolderFilesHash)
    .map(getFolderHash)

const calculatedHash = (folder:{ path: string; name: string; hash: string | undefined; dependencies: { name: string; path: string; hash: string }[] }) => {
    return {
        ...folder,
        calculatedHash: hash(folder.hash + folder.dependencies.map(dep => dep.hash).join())
    }
}



export class PackageManager{
    constructor(private repo_packages: {  name:string, path:string, hash:string}[]){}

    private isValidPackage = (item: { name: string; path: string; hash: string } | undefined): item is { name: string; path: string; hash: string } => {
        return !!item
    }
    public addHash = (srv: { path: string; name: string; dependencies: string[] })=> {
        return {
            path: srv.path,
            name: srv.name,
            hash: this.repo_packages.find(pkg => pkg.name === srv.name)?.hash || "",
            dependencies: srv.dependencies
                .sort()
                .map(dep => pkgs.find(pkg => pkg.name === dep))
                .filter(this.isValidPackage)
        }}
}

const srvc = services
    .map(getPackageNameAndDependenciesByPath)
    .map(new PackageManager(pkgs).addHash)
    .map(calculatedHash)

console.dir(srvc,{depth:3})






// export default class HashingService {
//
//     constructor(actionProvider:ActionProvider) {
//     }
//
//     public  getFolderHash: (filepath: string) => string = (filepath:string):string => {
//         return this.hashDirectorySync(filepath).hash
//     }
//
//     public  getHash: (value: string) => string = (value:string):string => {
//         const shasum = crypto.createHash('sha1');
//         shasum.update(value)
//         return shasum.digest('hex')
//     }
//
//     private  hashDirectorySync = (filepath:string) => {
//         const files = fs.readdirSync(filepath);
//
//         const directoryItems = files.map((file) => {
//             return this.hashDirectoryItemSync(path.join(filepath, file));
//         }).filter(x=>x!=null) as { mode: string; path: any; name: string; type: string; hash: string }[];
//
//         const buffers:Buffer[] = [];
//
//         directoryItems.sort((a, b) => a.name > b.name ? 1 : a.name > b.name ? -1 : 0);
//
//         directoryItems.forEach((di) => {
//             buffers.push(new Buffer(di.mode + " " + di.name + "\0", 'utf-8'));
//             buffers.push(new Buffer(di.hash, 'hex'));
//         });
//
//         const buffer = Buffer.concat(buffers);
//
//         const shasum = crypto.createHash('sha1');
//         shasum.update('tree ' + buffer.length.toString() + '\0');
//         shasum.update(buffer);
//
//         const digest = shasum.digest('hex');
//
//         return {
//             type: 'tree',
//             path: filepath,
//             name: path.basename(filepath),
//             hash: digest,
//             mode: '40000'
//         }
//     }
//     private  hashDirectoryItemSync = (filepath: string) => {
//         const stats: fs.Stats = fs.statSync(filepath);
//
//         if (stats.isDirectory()) {
//             if (filepath.endsWith("node_modules") || filepath.endsWith("dist") || filepath.endsWith("lib")) {
//                 return null;
//             }
//             return this.hashDirectorySync(filepath);
//         } else if (stats.isFile()) {
//
//             return this.hashFileSync(filepath, stats);
//         } else {
//             throw new Error("Unsupported directory item type");
//         }
//     }
//

// }

