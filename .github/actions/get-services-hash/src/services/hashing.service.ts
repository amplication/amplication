import { createHash } from "crypto"
import glob = require("glob")
import {readFileSync, Stats, statSync} from "fs";

export default class HashingService {

    constructor(private hashIgnore:string[]) {
    }

    public getFolderHash: (filepath: string) => string = (filepath:string):string => {
        return this.hash(this.getFiles(filepath)
            .map(this.getFilesStat)
            .map(this.getFileHash)
            .sort().join())
    }

    public getHash: (value: string) => string = (value:string):string => {
        const shasum = createHash('sha1');
        shasum.update(value)
        return shasum.digest('hex')
    }

    private getFiles = (path:string):string[] => {
        return glob.sync("**", {
                ignore: this.hashIgnore,
                cwd: path,
                mark: true,
                nodir: true,
                // realpath: true,
                absolute: true,
                nosort: false,
            })
    }

    private getFilesStat: (filepath: string) => { path: string; stats: Stats } = (filepath:string) => {
        return {
            path: filepath,
            stats: statSync(filepath)
        }
    }

    private getFileHash = (file:{ path: string; stats: Stats }) => {
        return this.hashFileSync(file.path, file.stats)
    }

    private hash = (value:string) => {
        const shasum = createHash('sha1');
        shasum.update(value);
        return shasum.digest('hex');
    }



    private  hashFileSync: (path: string, stats: Stats) => string = (path:string, stats:Stats) => {
        const shasum = createHash('sha1');

        // Use git's header.
        shasum.update('blob ' + stats.size + '\0');

        // Read the file, and hash the results.
        const buffer = readFileSync(path);
        shasum.update(buffer);

        // When the file is done, we have the complete shasum.
        return shasum.digest('hex');
    }
}