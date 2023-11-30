export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full text-center font-mono text-sm">
        <p className="mb-4 text-left mx-auto">
          Welcome! This page demonstrates how Edgio Edge Functions can be used
          with Next.js to modify cloud function responses at the edge. By
          visiting the link below, the following request flow will occur:
        </p>
        <ol className="list-decimal list-inside text-left my-4">
          <li>
            The browser will request the page{' '}
            <code className="bg-gray-700 p-1 rounded">/edge-override</code>.
          </li>
          <li>
            Edgio will match this request as defined in the{' '}
            <code className="bg-gray-700 p-1 rounded">routes.ts</code> file and
            process it through{' '}
            <code className="bg-gray-700 p-1 rounded">
              ./edge-functions/index.js
            </code>
            .
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
            The edge function will modify the response and send it to the
            browser.
          </li>
        </ol>
        <a
          href="/edge-override"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to /edge-override
        </a>
      </div>
      <footer className="z-0 absolute bottom-0 left-0 right-0 bg-gray-800 text-gray-100 text-center text-xs py-2">
        <a href="https://github.com/edgio-docs/edgio-v7-ef-cloud-fetch-example">
          Example Source Code
        </a>
      </footer>
    </main>
  );
}
