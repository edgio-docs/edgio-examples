import { CohereClient } from 'cohere-ai';

const { COHERE_API_TOKEN } = process.env;

export default function cohereHandler({ compute }) {
  compute(async (req, res) => {
    const { text } = JSON.parse(req.body);

    if (!text) {
      res.statusCode = 400;
      res.statusMessage = 'Text is required for summarization.';
      return;
    }

    const cohere = new CohereClient({
      token: COHERE_API_TOKEN,
    });

    try {
      const summary = await cohere.summarize({
        text: text,
      });

      res.body = JSON.stringify({ summary });
    } catch (error) {
      console.error('Error summarizing text:', error);
      res.statusCode = 500;
      res.statusMessage = 'Failed to summarize text.';
    }
  });
}
