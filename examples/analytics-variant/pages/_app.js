import '../styles/globals.css';
import { GoogleAnalytics } from 'nextjs-google-analytics';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics gaMeasurementId="G-001EVGR2Y7" trackPageViews />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
