import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"

export default class HashingService {

    public  getFolderHash: (filepath: string) => string = (filepath:string):string => {
        return this.hashDirectorySync(filepath).hash
    }

    public  getHash: (value: string) => string = (value:string):string => {
        const shasum = crypto.createHash('sha1');
        shasum.update(value)
        return shasum.digest('hex')
    }

    private  hashDirectorySync = (filepath:string) => {
        const files = fs.readdirSync(filepath);

        const directoryItems = files.map((file) => {
            return this.hashDirectoryItemSync(path.join(filepath, file));
        }).filter(x=>x!=null) as { mode: string; path: any; name: string; type: string; hash: string }[];

        const buffers:Buffer[] = [];

        directoryItems.sort((a, b) => a.name > b.name ? 1 : a.name > b.name ? -1 : 0);

        directoryItems.forEach((di) => {
            buffers.push(new Buffer(di.mode + " " + di.name + "\0", 'utf-8'));
            buffers.push(new Buffer(di.hash, 'hex'));
        });

        const buffer = Buffer.concat(buffers);

        const shasum = crypto.createHash('sha1');
        shasum.update('tree ' + buffer.length.toString() + '\0');
        shasum.update(buffer);

        const digest = shasum.digest('hex');

        return {
            type: 'tree',
            path: filepath,
            name: path.basename(filepath),
            hash: digest,
            mode: '40000'
        }
    }
    private  hashDirectoryItemSync = (filepath: string) => {
        const stats: fs.Stats = fs.statSync(filepath);

        if (stats.isDirectory()) {
            if (filepath.endsWith("node_modules") || filepath.endsWith("dist") || filepath.endsWith("lib")) {
                return null;
            }
            return this.hashDirectorySync(filepath);
        } else if (stats.isFile()) {

            return this.hashFileSync(filepath, stats);
        } else {
            throw new Error("Unsupported directory item type");
        }
    }

    private  hashFileSync = (filepath:string, stats:fs.Stats) => {
        const shasum = crypto.createHash('sha1');

        // Use git's header.
        shasum.update('blob ' + stats.size + '\0');

        // Read the file, and hash the results.
        const buffer = fs.readFileSync(filepath);
        shasum.update(buffer);

        // When the file is done, we have the complete shasum.
        const d = shasum.digest('hex');
        return {
            type: 'blob',
            path: filepath,
            name: path.basename(filepath),
            hash: d,
            mode: '100644'
        };
    }
}