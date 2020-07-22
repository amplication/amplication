import ncp from "ncp";

export function recursiveCopy(
  source: string,
  destination: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ncp(source, destination, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
