# Edge-side Experiments with Optimizely

This example demonstrates how you may use edge functions to run Optimizely experiments.

The request workflow is as follows:

- The client makes a request to `/` which is handled by an edge function.
- The edge function fetches the Optimizely experiment variant and decides which text direction to use based on the variant.
- The edge function makes another fetch request to the Wikipedia homepage and gets the HTML content.
- The edge function modifies the HTML content to include the experiment variant and returns it to the client.
- The edge function sets the experiment variant cookie and returns the page to the client.
- Depending on the experiment variant, the page may render normal or mirrored based on the applied transformation.

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

5. Open [http://localhost:3000/](http://localhost:3000/) with your browser to see the result. Note: The page may render normally or mirrored based on the experiment variant.
