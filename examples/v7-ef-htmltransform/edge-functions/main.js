/**
 * An example edge function which forwards the request to the origin.
 * See routes.js for how this function is configured to run for requests to "/".
 */
export async function handleHttpRequest(request) {
  console.log(request.url)
  const resp = await fetch('https://test-origin.edgio.net', {
    edgio: {
      origin: 'origin', // this corresponds to the name of the origin in edgio.config.js
    },
  })

  // handle the response as needed
  // For example, to inject some html into the body:
  const html = await resp.text()
  const newHtml = html.replace('</body>', '<marquee>Added by edge functions!</marquee></body>')

  // To send the response to the client with the new HTML but the same headers as the origin response:
  return new Response(newHtml, {
    ...resp,
    headers: {
      ...resp.headers,
      'x-edge-function': 'main.js',
    },
  })

  // Or you can just return the original response to the client
  // return resp
}
