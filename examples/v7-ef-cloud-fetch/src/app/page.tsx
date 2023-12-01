export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="max-w-5xl text-left">
        Welcome! This page demonstrates how Edge Functions can be used with
        Next.js to modify the cloud function responses at the edge. By visiting
        the link below, the following request flow will occur:
      </h2>
      <div className="z-10 max-w-5xl w-full text-center font-mono text-sm">
        <ol className="list-decimal list-inside text-left my-4">
          <li>
            The browser will request the page <pre>/example</pre>.
          </li>
          <li>
            Edgio will match this request as defined in the <pre>routes.ts</pre>{' '}
            file and process it through <pre>./edge-functions/index.js</pre>.
          </li>
          <li>
            The edge function will request the page from the Next.js server
            cloud function.
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

      <div className="text-center font-mono text-sm flex items-center justify-between space-x-4">
        <a
          href="/example"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80" // width set to 320px (80 * 4)
        >
          Go to <pre>/example</pre>
          <br />
          (cloud function only)
        </a>
        <a
          href="/example?edge=1"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80" // width set to 320px (80 * 4)
        >
          Go to <pre>/example?edge=1</pre>
          <br />
          (edge function =&gt; cloud function)
        </a>
      </div>

      <div className="text-center text-md mt-4">
        <a href="https://github.com/edgio-docs/edgio-v7-ef-cloud-fetch-example">
          Example Source Code
        </a>
      </div>
    </main>
  );
}
