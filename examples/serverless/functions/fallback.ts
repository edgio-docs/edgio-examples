import Request from "@edgio/core/router/Request";
import Response from "@edgio/core/router/Response";

/**
 * This function is called for all requests that don't match a route.
 * @param req The request
 * @param res The response
 */
export default async function fallback(req: Request, res: Response) {
  res.setHeader("content-type", "application/json");
  res.body = JSON.stringify({ url: req.url });
}
