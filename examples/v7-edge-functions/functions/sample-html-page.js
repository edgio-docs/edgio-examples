export async function handleHttpRequest(request, context) {
  const content = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <title>Hello Edgio!</title>
            <style>html{font-family:sans-serif}</style>
        </head>
        <body>
          <h1>Salutations from Edgio Functions!</h1>
          <p>This is a sample HTML page. Please see the examples below:</p>
          <ul>
            <li><a href="/">This page</a></li>
            <li><a href="/example/change-headers.json">Change headers example</a></li>
            <li><a href="/example/generate.json">Generate a JSON response</a></li>
          </ul>
        </body>
      </html>`;

  const response = new Response(content, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });

  context.respondWith(response);
}
