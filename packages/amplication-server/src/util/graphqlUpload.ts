import { FileUpload } from "graphql-upload";

export async function graphqlUpload(file: FileUpload) {
  const chunks = [];
  for await (const chunk of file.createReadStream()) {
    chunks.push(chunk);
  }
  const fileBuffer = Buffer.concat(chunks);
  const fileContent = fileBuffer.toString("utf8");

  return fileContent;
}
