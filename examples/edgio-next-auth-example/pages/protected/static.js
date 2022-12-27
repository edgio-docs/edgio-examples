import Layout from "../../components/layout";

export default function StaticProtected({ message }) {
  return (
    <Layout>
      <h1>Protected Static Page</h1>
      <p>
        <b>{message}</b>
      </p>
    </Layout>
  );
}

export function getStaticProps() {
  return {
    props: {
      message:
        "This is protected content. You can access this content because you are signed in.",
    },
  };
}
