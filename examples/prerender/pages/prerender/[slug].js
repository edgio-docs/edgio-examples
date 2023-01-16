const Dynamic = ({ slug, dateCreated }) => {
  return `Page: ${slug}, Created At: ${dateCreated}`
}

export default Dynamic

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  return {
    props: {
      slug: context.params.slug,
      dateCreated: new Date().toString(),
    },
  }
}
