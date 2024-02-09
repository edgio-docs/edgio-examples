import '../../utils/polyfills/URL';

export async function handleHttpRequest(request, context) {
  const url = new URL(request.url);
  const domain = `${url.protocol}//${url.host}`;

  function createCURLCommand(path) {
  return `curl -i ${domain}${path}`;
}

  const content = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <title>Welcome to Edgio!</title>
            <style>
              html, body {
                margin: 0;
                padding: 0;
                font-family: 'Roboto', sans-serif;
                background: #F5F5F5;
                color: #212121;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              pre {
                text-wrap: wrap;
              }
              h1 {
                background: #6200EE;
                color: #FFF;
                padding: 15px;
                margin: 0;
                font-size: 22px;
                text-align: center;
                width: 100%;
              }
              p {
                padding: 10px 15px;
                font-size: 16px;
              }
              .grid-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
                gap: 20px;
                justify-content: center;
                width: 100%;
                max-width: 1600px;  /* 500px * 3 + 2 * 20px (gap) */
              }
              section {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 15px 0;
                padding: 10px;
                background-color: #FFF;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                border-radius: 5px;
              }
              h2 {
                font-size: 20px;
                margin: 0 0 10px 0;
              }
              ul {
                padding: 0;
                display: flex;
                flex-direction: column;
                gap: 5px;
                width: 100%;
                list-style-type: none;
              }
              a {
                text-decoration: none;
                color: #6200EE;
                transition: color 0.2s ease;
                padding: 5px 0;
              }
              a:hover {
                color: #3700B3;
              }
              pre {
                overflow-wrap: break-word;
                white-space: pre-wrap;
              }

              p pre {
                display: inline;
              }
            </style>
        </head>
        <body>
          <h1>Welcome to Edgio Functions!</h1>
          <p>Explore Edgio's functionalities:</p>

          <div class="grid-container">
            <section>
              <h2>Simple Edge Function</h2>
              <p>A basic "Hello World" example.</p>
              <a href="/example/hello-world">View Example</a>
              <pre><code>${createCURLCommand(
                '/example/hello-world'
              )}</code></pre>
            </section>

            <section>
              <h2>Header Manipulation</h2>
              <p>Manipulate headers in your response.</p>
              <a href="/example/change-headers.json">View Example</a>
              <pre><code>${createCURLCommand(
                '/example/change-headers.json'
              )}</code></pre>
            </section>

            <section>
              <h2>JSON Response Generation</h2>
              <p>Generate dynamic JSON responses.</p>
              <a href="/example/generate.json">View Example</a>
              <pre><code>${createCURLCommand(
                '/example/generate.json'
              )}</code></pre>
            </section>

            <section>
              <h2>Content Stitching</h2>
              <p>Combine content with HTML injections.</p>
              <a href="/example/content-stitching">View Example</a>
              <pre><code>${createCURLCommand(
                '/example/content-stitching'
              )}</code></pre>
            </section>

            <section>
              <h2>Redirect Examples</h2>
              <p>Simulate redirect scenarios.</p>
              <ul>
                <li>
                  <a href="/example/redirects/first">Redirect Based on Path</a>
                  <pre><code>${createCURLCommand(
                    '/example/redirects/first'
                  )}</code></pre>
                </li>
                <li>
                  <a href="/example/redirects?queryRedirect=example">Redirect Based on Query</a>
                  <pre><code>${createCURLCommand(
                    '/example/redirects?queryRedirect=example'
                  )}</code></pre>
                </li>
                <li>
                  <a href="/example/redirects/no-redirect-match">No Redirect Match</a>
                  <pre><code>${createCURLCommand(
                    '/example/redirects/no-redirect-match'
                  )}</code></pre>
                </li>
              </ul>
            </section>

            <section>
              <h2>Database Examples</h2>
              <p>Explore database interactions using different databases.</p>
              <ul>
                <li>
                  <h4>PlanetScale Database (<a href="/example/planetscale-database">View Example</a>)</h4>
                  <p>Transactional queries with a PlanetScale database.</p>
                </li>
                <li>
                  <h4>Upstash Database (<a href="/example/upstash-database">View Example</a>)</h4>
                  <p>A waiting room example using Upstash + Redis.</p>
                </li>
              </ul>
            </section>

            <section>
              <h2>Caching</h2>
              <p>Examples demonstrating caching for different request types. Observe unique caching for GET and POST w/ body requests.</p>
              <ul>
                <li>
                  <strong>GET Request</strong>
                  <pre><code>${createCURLCommand(
                    '/example/caching'
                  )}</code></pre>
                </li>
                <li>
                  <strong>POST Request with JSON payload 1</strong>
                  <pre><code>curl -i -X POST ${domain}/example/caching -d '{"key": "value1"}'</code></pre>
                </li>
                <li>
                  <strong>POST Request with JSON payload 2</strong>
                  <pre><code>curl -i -X POST ${domain}/example/caching -d '{"key": "value2"}'</code></pre>
                </li>
              </ul>
            </section>

            <section>
              <h2>Request Signing</h2>
              <p>Request signing and verification using <strong>crypto-js</strong>. Generated URLs are valid for 60 seconds.</p>
              <p><a href="/example/signed-request/sign/foo/bar">Generate Signed URL</a></p>
            </section>


          </div>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://docs.edg.io/guides/v7/edge-functions" target="_blank">Edge Functions Documentation</a> | <a href="https://github.com/edgio-docs/edgio-v7-edge-functions-example" target="_blank">View the demo code on GitHub</a>
            <p style="margin-top: 10px; font-size: 14px; color: #FF5733;"><strong>Note</strong>: Edge Functions requires activation on your account. <a href="https://docs.edg.io/guides/v7/edge-functions">Learn more.</a></p>
          </div>
        </body>
      </html>`;

  return new Response(content, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
