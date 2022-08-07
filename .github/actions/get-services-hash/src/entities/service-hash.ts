export class ServiceHash {
    constructor(public pkg: string,
                public folder: string,
                public hash: string,
                public dependencies: string[]){}
}