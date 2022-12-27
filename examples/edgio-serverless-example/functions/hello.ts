import Request from "@edgio/core/router/Request";
import Response from "@edgio/core/router/Response";

/**
 * GET /hello/:name
 * @param req The request
 * @param res The response
 */
export default function hello(req: Request, res: Response) {
  const name = req.params?.name;
  res.setHeader("content-type", "application/json");
  res.body = JSON.stringify({ message: `hello ${name}` });
}
