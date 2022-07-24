export class App{
    constructor(private workingDirectory:string,
                private files:string[],
                private ignoreFolders:string[]) {
    }


    private getSubDirectories:(directory:string)=>string[] = (directory:string):string[]=>
        fs.readdirSync(`${this.workingDirectory}/${directory}`, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(value=>`${directory}/${value.name}`)

    private directoryHasFile:(directory:string)=>boolean = (directory:string):boolean =>
        fs.readdirSync(`${this.workingDirectory}/${directory}`,{ withFileTypes: true })
            .filter(dirent => dirent.isFile())
            .some(file=>this.files.includes(file.name))

    private notIgnored:(directory:string)=>boolean = (directory:string):boolean => !this.ignoreFolders.some(ignoredDirectory=>directory.endsWith(ignoredDirectory))

    private splitFoldersByFile(directories:string[]):[string[],string[]] {
        const _directories = directories.filter(this.notIgnored)
            .map((directory: string) => {
                return {
                    directory: directory,
                    hasDockerfile: this.directoryHasFile(directory)
                }
            })
        return [_directories.filter(value => value.hasDockerfile).map(value => value.directory),
            _directories.filter(value => !value.hasDockerfile).map(value => value.directory)]
    }

    public findFoldersContainingDockerfile(includeFolders:string[],
                                           recursive:boolean=false):string[] {

        const [foldersWithFiles,foldersWithoutFiles] = this.splitFoldersByFile(includeFolders)
        if(recursive) {
            if(includeFolders.length===0){
                return [];
            }

            return foldersWithFiles.concat(foldersWithoutFiles.map(directory => this.getSubDirectories(directory))
                .flatMap(subDirectories => this.findFoldersContainingDockerfile(subDirectories,recursive)));
        } else {
            return foldersWithFiles;
        }



    }
}