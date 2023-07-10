import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Error Handling Example</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Edgio Error Handling Examples</h1>

        <p className={styles.description}>
          This app shows you how to handle errors at the edge.
        </p>

        <div className={styles.grid}>
          <a href="/api/500" className={styles.card}>
            <h2>Custom Error Page &rarr;</h2>
            <p>
              This example catches 500 errors and renders
              /pages/custom-error-page.js
            </p>
          </a>
          <a href="/pricing" className={styles.card}>
            <h2>Retry from a different origin&rarr;</h2>
            <p>
              Retries the request from a different origin if the original
              request returns a 4xx error.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
