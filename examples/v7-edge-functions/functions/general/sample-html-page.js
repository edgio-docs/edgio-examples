export async function handleHttpRequest(request, context) {
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
            </style>
        </head>
        <body>
          <h1>Welcome to Edgio Functions!</h1>
          <p>Explore Edgio's functionalities:</p>

          <div class="grid-container">
            <section>
              <h2>Header Manipulation</h2>
              <p>Manipulate headers in your response.</p>
              <a href="/example/change-headers.json">View Example</a>
            </section>

            <section>
              <h2>JSON Response Generation</h2>
              <p>Generate dynamic JSON responses.</p>
              <a href="/example/generate.json">View Example</a>
            </section>

            <section>
              <h2>Content Stitching</h2>
              <p>Combine content with HTML injections.</p>
              <a href="/example/content-stitching">View Example</a>
            </section>

            <section>
              <h2>Redirect Examples</h2>
              <p>Simulate redirect scenarios.</p>
              <ul>
                <li><a href="/example/redirects/first">Redirect Based on Path</a></li>
                <li><a href="/example/redirects?queryRedirect=example">Redirect Based on Query</a></li>
                <li><a href="/example/redirects/no-redirect-match">No Redirect Match</a></li>
              </ul>
            </section>
          </div>
        </body>
      </html>`;

  return new Response(content, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
