import type { NextApiRequest, NextApiResponse } from "next";
import { uploadFiles } from "@/components/filehandling/blobupload";
import parseMultipartFormData from "@anzp/azure-function-multipart";
import { parse, ParseConfig } from "papaparse";
import { clientPrincipal } from "@/components/filehandling/blobupload";
import multer from 'multer';

async function parseFormData(
  req: NextApiRequest & { files?: any },
  res: NextApiResponse
) {
  const storage = multer.memoryStorage();
  const multerUpload = multer({ storage });
  const multerFiles = multerUpload.any();
  await new Promise((resolve, reject) => {
    multerFiles(req as any, res as any, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
  return {
    fields: req.body,
    files: req.files
  }
}
function createFileEntry(parsedFileName: string, errors : any) {
  if (errors[parsedFileName] == undefined) {
    errors[parsedFileName] = {};
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let responseStatusCode: number;
  let responseMessage: string;

  // get user info
  const header = req.headers["x-ms-client-principal"] as any;
  const encoded = Buffer.from(header, "base64");
  const decoded = encoded.toString("ascii");
  const userInfo: clientPrincipal = JSON.parse(decoded);

  if (req.body) {
    const { fields, files } = await parseFormData(req, res);
    const plot = req.query.plot as string;

    // simple validation here
    const headers = [
      "tag","plot_id","subquadrat_id","census_id","stem_dia","htmeas","codes","comments",
    ];

    // array for collected errors
    const errors: { [fileName: string]: { [currentRow: string]: string } } = {};

    

    for (const parsedFile of files) {
      // without the transformHeader parameter first header is parsed with quotes

      const config: ParseConfig = {
        delimiter: ",",
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(),
      };
      const results = parse(parsedFile.bufferFile.toString("utf-8"), config);

      // If there is no data, send response immediately
      if (!results.data.length) {
        console.log("No data for upload!");
        createFileEntry(parsedFile.filename, errors);
        errors[parsedFile.filename]["error"] = "Empty file";
        return;
      }

      results.data.map((csv, index) => {
        const csvHeaders = Object.keys(csv);
        const currentRow = index + 1;

        if (!csvHeaders.every((entry) => headers.includes(entry))) {
          createFileEntry(parsedFile.filename, errors);
          console.log("Headers test failed!");
          errors[parsedFile.filename]["headers"] = "Missing Headers";
        }

        csvHeaders.map((key) => {
          if (csv[key] === "" || undefined) {
            createFileEntry(parsedFile.filename, errors);
            errors[parsedFile.filename][currentRow] = "Missing value";
            console.log(errors[parsedFile.filename][currentRow]);
          } else if (key === "DBH" && parseInt(csv[key]) < 1) {
            createFileEntry(parsedFile.filename, errors);
            errors[parsedFile.filename][currentRow] = "Check the value of DBH";
            console.log(errors[parsedFile.filename][currentRow]);
          }
        });
      });
      if (results.errors.length) {
        createFileEntry(parsedFile.filename, errors);
        console.log(
          `Error on row: ${results.errors[0].row}. ${results.errors[0].message}`
        );
        errors[parsedFile.filename][results.errors[0].row] =
          results.errors[0].message;
      }
    }

    if (Object.keys(errors).length === 0) {
      uploadFiles(files, plot, userInfo);
      res.json({
        status: 201,
        body: {
          responseMessage: "File(s) uploaded to the cloud successfully",
          errors: {},
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      return;
    } else {
      res.json({
        status: 400,
        body: {
          responseMessage: "Error(s)",
          errors: errors,
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
      return;
    }
  } else {
    responseStatusCode = 400;
    responseMessage = "Something went wrong";
  }

  res.json({
    status: responseStatusCode,
    body: responseMessage,
  });
}