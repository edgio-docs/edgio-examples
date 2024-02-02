import { headers } from 'next/headers';

export default async function ExamplePage() {
  // Add in reference to headers() to force this page to be server-side rendered and handled as a cloud function.
  // Otherwise, this page will be rendered as a static page and not handled as a cloud function.
  const headersList = headers();
  const referer = headersList.get('referer');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1>Edgio Cloud Functions</h1>
        <p>This page was rendered by Edgio Cloud Functions.</p>
      </div>

      <footer className="mt-auto">Referer: {referer}</footer>
    </div>
  );
}
