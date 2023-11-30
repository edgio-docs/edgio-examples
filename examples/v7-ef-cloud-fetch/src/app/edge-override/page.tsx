import { headers } from 'next/headers';

export default async function EdgioCloudFunctionsPage() {
  // add in reference to headers() to force this page to be server-side rendered
  const headersList = headers();
  const referer = headersList.get('referer');

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div>
        <h1>Edgio Cloud Functions</h1>
        <p>This page was rendered by Edgio Cloud Functions.</p>
        <div>Referer: {referer}</div>
      </div>
    </div>
  );
}
