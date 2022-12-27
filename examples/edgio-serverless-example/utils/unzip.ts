import Request from "@edgio/core/router/Request";
import Zlib from "zlib";

/**
 * Returns the unzipped request body as a string.
 * @param req The request
 * @returns
 */
export default function unzip(req: Request): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const { rawBody } = req;

    if (rawBody) {
      Zlib.gunzip(toArrayBuffer(rawBody), (error, result) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(result.toString());
        }
      });
    } else {
      return reject(new Error("No body was provided."));
    }
  });
}
