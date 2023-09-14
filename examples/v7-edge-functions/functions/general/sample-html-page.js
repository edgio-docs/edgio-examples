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
              }
              h1 {
                background: #6200EE;
                color: #FFF;
                padding: 20px;
                margin: 0;
                font-size: 26px;
                text-align: center;
              }
              p {
                padding: 16px 20px;
                font-size: 18px;
              }
              ul {
                margin: 0;
                padding: 0;
                display: grid;
                gap: 10px;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              }
              li {
                list-style-type: none;
                padding: 12px;
                background-color: #FFF;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                border-radius: 5px;
                transition: transform 0.3s;
              }
              li:hover {
                transform: translateY(-5px);
              }
              a {
                text-decoration: none;
                color: #6200EE;
                transition: color 0.3s ease;
              }
              a:hover {
                color: #3700B3;
              }
            </style>
        </head>
        <body>
          <h1>Welcome to Edgio Functions!</h1>
          <p>Explore various functionalities provided by Edgio through the following examples:</p>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/example/change-headers.json">Header Manipulation</a></li>
            <li><a href="/example/generate.json">JSON Response Generation</a></li>
            <li><a href="/example/content-stitching">Content Stitching w/ HTML Injection</a></li>
            <li><a href="/example/planetscale-database">Database Transactions with PlanetScale</a></li>
            <li><a href="/example/upstash-database">Upstash: Waiting Room Simulation</a></li>
          </ul>
        </body>
      </html>`;

  return new Response(content, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
