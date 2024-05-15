# Edge-side Experiments with Optimizely and Next.js

This project is a simple Next.js app that demonstrates how to use edge functions to run Optimizely experiments. The app is a Next.js starter project using server components that renders the text direction based on the experiment variant provided as a query parameter.

The request workflow is as follows:

- The client makes a request to `/optimizely` which is handled by an edge function.
- The edge function fetches the Optimizely experiment variant and decides which text direction to use based on the variant.
- The edge function makes another fetch request to `/` - the Next.js app, with the experiment variant as the `dir` query parameter.
- The Next.js app renders the page on the server with the text direction based on the query parameter.
- The server-rendered page response is returned to the edge function.
- The edge function sets the experiment variant cookie and returns the page to the client.

## Getting Started

1. Clone the repository:

```bash
git clone ...
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root of the project and add the following environment variables:

```bash
OPTIMIZELY_SDK_KEY=...
```

4. Start the development server:

```bash
npm run edgio:dev
```

5. Open [http://localhost:3000/optimizely](http://localhost:3000/optimizely) with your browser to see the result. This will set a cookie to ensure you remain on the experience across page navigation. Issue multiple requests using `curl` to see the experiment variant change:

```bash
curl http://localhost:3000/optimizely | grep 'direction:'
```

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
