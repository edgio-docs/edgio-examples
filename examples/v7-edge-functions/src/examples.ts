const examples = [
  {
    title: 'Basics',
    description: 'Basic examples',
    items: [
      {
        filepath: './functions/edge-function.js',
        href: 'basics/hello-world',
        title: 'Hello World',
        description: 'A simple function that returns a string.',
      },
      {
        filepath: './functions/general/change-headers.js',
        href: 'basics/headers',
        title: 'Headers',
        description: 'Manipulate headers in your response.',
      },
      {
        href: 'basics/json',
        title: 'JSON',
        description: 'Generate dynamic JSON responses.',
      },
      {
        href: 'basics/content-stitching',
        title: 'Content Stitching',
        description: 'Combine content with HTML injections.',
      },
    ],
  },
  {
    title: 'Redirects',
    description: 'Redirect examples',
    items: [
      {
        href: 'redirects/first',
        title: 'Redirect Based on Path',
        description: 'Redirect based on path.',
      },
      {
        href: 'redirects/query',
        title: 'Redirect Based on Query',
        description: 'Redirect based on query.',
      },
      {
        href: 'redirects/no-redirect-match',
        title: 'No Redirect Match',
        description: 'No redirect match.',
      },
    ],
  },
  {
    title: 'Database Examples',
    description: 'Examples demonstrating database usage',
    items: [
      {
        href: 'database/planetscale',
        title: 'PlanetScale Database',
        description: 'Transactional queries with a PlanetScale database.',
      },
      {
        href: 'database/waiting-room',
        title: 'Waiting Room using PlanetScale',
        description:
          'A waiting room example using PlanetScale for session tracking.',
      },
    ],
  },
  {
    title: 'Caching',
    description:
      'Examples demonstrating caching for different request types. Observe unique caching for GET and POST w/ body requests.',
    items: [
      {
        href: 'caching',
        title: 'GET Request',
        description: 'Caching a standard GET request.',
      },
      {
        href: 'caching/post',
        title: 'POST Request with Payload',
        description: 'Caching a POST request with a JSON payload.',
      },
    ],
  },
];

export default examples;

export function getExampleByHref(href) {
  for (const example of examples) {
    for (const item of example.items) {
      if (item.href === href) {
        return item;
      }
    }
  }
}
