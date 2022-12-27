import Request from "@edgio/core/router/Request";
import Response from "@edgio/core/router/Response";
import { unzipSync } from "zlib";
import toArrayBuffer from "../utils/toArrayBuffer";

/**
 * POST /log
 *
 * Here's an example that shows you how to handle compressed POST bodies using zlib.
 *
 * Here's an example cURL that you can use to test this function locally:
 * curl -v -H 'Content-Encoding: gzip' --data-binary @requests/logs.json.gz http://localhost:3000/log
 *
 * @param req The request
 * @param res The response
 */
export default function log(req: Request, res: Response) {
  const { rawBody } = req;

  try {
    if (rawBody) {
      const body = unzipSync(toArrayBuffer(rawBody));
      res.body = JSON.stringify({ body: body.toString() });
    } else {
      throw new Error("The request must contain a body.");
    }
  } catch (e) {
    res.statusCode = 400;
    res.statusMessage = "Bad Request";
    res.body = JSON.stringify({ message: e.message, stack: e.stack });
  }
}
