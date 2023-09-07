import MD5 from "crypto-js/md5";

export const encryptString = (str: string) => MD5(str).toString();
