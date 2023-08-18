import type { NextApiRequest, NextApiResponse } from "next";
import showFiles, { FileWithMetadata } from "@/components/filehandling/blobdownload";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const plot = req.query.plot as string;
  console.log(plot);

  let responseStatusCode: number;
  let responseMessage: string;
  let responseHeaders: object;

  if (plot) {
    // proceed with blobDownload function
    const listOfFiles = await showFiles(plot);
    console.log(listOfFiles);
    if (!listOfFiles) {
      responseStatusCode = 400;
      responseHeaders = { "Content-Type": "application/json" };
      responseMessage = "Error(s)";
    } else {
      responseStatusCode = 200;
      responseHeaders = { "Content-Type": "application/json" };
      responseMessage = listOfFiles as any;
    }
  } else {
    responseStatusCode = 400;
    responseMessage = "Something went wrong";
  }
  res.json({
    status: responseStatusCode,
    headers: responseHeaders!,
    body: responseMessage,
  });
};