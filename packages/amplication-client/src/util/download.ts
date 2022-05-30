import download from "downloadjs";


export async function downloadFile(uri: string): Promise<void> {
    const res = await fetch(uri);
    const body = await res.json();
    const fileLink = body.uri;
    switch (res.status) {
      case 200: {
        download(fileLink);
        break;
      }
      case 404: {
        throw new Error("File not found");
      }
      default: {
        throw new Error(await res.text());
      }
    }
  }