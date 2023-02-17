export default ({ setHead }) => {
  setHead({
    link: [
      {
        href: '/app.css',
        rel: 'stylesheet',
      },
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
        rel: 'stylesheet',
      },
    ],
  })
}
