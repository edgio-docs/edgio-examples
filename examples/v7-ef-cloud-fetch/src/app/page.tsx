export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="max-w-5xl text-left">
        Welcome! Edge Functions can be used with Next.js to modify cloud
        function responses at the edge.
      </h2>

      <div className="text-center mt-6">
        <h3>The request workflow without Edge Functions is:</h3>
        <div className="z-10 max-w-5xl w-full text-center font-mono text-sm">
          <ol className="list-decimal list-inside text-left my-4">
            <li>
              The browser will request the page <pre>/example</pre>.
            </li>
            <li>
              Edgio will match this request as defined in the{' '}
              <pre>routes.ts</pre> file and process it through Next.js as a
              cloud function.
            </li>
            <li>
              The Next.js server will render the page and the response will be
              sent to the browser.
            </li>
          </ol>
        </div>

        <a
          href="/example"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80"
        >
          View original Cloud Function page <br /> (go to <pre>/example</pre>)
        </a>
      </div>

      <div className="text-center mt-6">
        <h3>The request workflow with Edge Functions is:</h3>
        <div className="z-10 max-w-5xl w-full text-center font-mono text-sm">
          <ol className="list-decimal list-inside text-left my-4">
            <li>
              The browser will request the page <pre>/example?edge=1</pre>.
            </li>
            <li>
              Edgio will match this request as defined in the{' '}
              <pre>routes.ts</pre> file and process it through{' '}
              <pre>./edge-functions/index.js</pre>.
            </li>
            <li>
              The edge function will issue a fetch request to the{' '}
              <pre>edgio_serverless</pre> origin, forwarding the original
              request to the Next.js cloud function.
            </li>
            <li>
              The Next.js server will render the page and respond to the edge
              function.
            </li>
            <li>
              The edge function will modify the response, replacing{' '}
              <pre>Edgio Cloud Functions</pre> with{' '}
              <pre>Edgio Edge Functions</pre>, and send it to the browser.
            </li>
          </ol>
        </div>

        <a
          href="/example?edge=1"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80"
        >
          View Edge Function page <br /> (go to <pre>/example?edge=1</pre>)
        </a>
      </div>

      <div className="text-center text-md mt-4 underline">
        <a href="https://github.com/edgio-docs/edgio-v7-ef-cloud-fetch-example">
          View Source Code
        </a>
      </div>
    </main>
  );
}
