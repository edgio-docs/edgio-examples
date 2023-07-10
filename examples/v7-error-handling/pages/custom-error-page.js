import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Error Handling Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Custom Error Page</h1>

        <p className={styles.description}>
          We display this custom error page whenever the origin returns a 5xx
          error using this route in routes.js:
        </p>
        <code className={styles.code}>{`router.catch(/^5.*/, {\n
  url: { follow_redirects: true },\n
  response: { set_status_code: 302 },\n
  headers: {\n
    set_response_headers: {\n
      location: "%{scheme}://%{host}/custom-error-page",\n
    },\n
  },\n
})`}</code>

        <p>
          <Link href="/">Home</Link>
        </p>
      </main>
    </div>
  );
  return <div>This is a custom 500 error page.</div>;
}
