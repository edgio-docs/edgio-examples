This is a Next.js project bootstrapped with `create-next-app`, integrating with Cohere AI and powered by Edgio.

## Getting Started

### Install Packages

```bash
npm install
```

### Setup Environment Variables

Set up environment variables in a `.env` file by copying the `.env.example` file to `.env`.

```bash
cp .env.example .env
```

Replace `YOUR_COHERE_API_KEY` with your Cohere AI API key.

### Local Development Server

```bash
npm run edgio:dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` to automatically optimize and load Inter, a custom Google Font.

### Cohere AI Integration

This application demonstrates a simple use case for text summarization using Cohere AI's powerful natural language processing capabilities. Users can input a text of at least 250 characters, and the app will display a summarized version of the text.

To get started with the text summarization feature:

1. Navigate to the home page at http://localhost:3000.
2. Enter your text into the textarea provided.
3. Click the `Summarize` button to see the summarized text.

Please ensure you have set up your Cohere AI API key correctly in your environment variables or within the application to use the summarization feature.

To learn more about Edgio, take a look at the following resources:

- [Edgio Documentation](https://docs.edg.io) - learn about Edgio features

## Deploy on Edgio

Deploy this project on Edgio with the following command:

```bash
npm run edgio:deploy
```

Check out our [Cohere AI documentation](https://docs.edg.io/guides/v7/ai_integrations/cohere) for more details.
