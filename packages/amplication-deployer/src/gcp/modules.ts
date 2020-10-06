import path from "path";
import tarFs from "tar-fs";

const MODULES_DIRECTORY = path.resolve(__dirname, "modules");

export function createTar(): tarFs.Pack {
  return tarFs.pack(MODULES_DIRECTORY, {
    map: (header) => {
      header.name = `modules/${header.name}`;
      return header;
    },
  });
}
