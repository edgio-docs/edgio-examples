'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState(defaultStory);
  const [summary, setSummary] = useState(null);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // clear previous summary and error
    setSummary(null);
    setError('');

    if (text.length < 250) {
      setError('Text must be at least 250 characters long.');
      return;
    }
    try {
      const response = await fetch('/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setSummary(data.summary);
      setError('');
    } catch (error) {
      console.error(error);
      setError('An error occurred while summarizing the text');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-7xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome to Cohere-AI on Edgio!
        </h1>
        <p className="mb-8 text-center">
          Use the form below to summarize your text.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            <textarea
              className="appearance-none bg-transparent border border-blue-500 w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none h-40"
              placeholder="Enter text to summarize"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded mt-4"
              type="submit"
            >
              Summarize
            </button>
          </div>
          {error && (
            <div className="mt-2 text-red-500 text-center">
              <p>{error}</p>
            </div>
          )}
        </form>
        {summary && (
          <>
            <hr className="my-8" />
            <div className="mt-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Summary:</h2>
              <p>{summary.summary}</p>
              style
              <pre className="overflow-x-auto mt-5 p-3 whitespace-pre-wrap bg-gray-800 text-white text-left font-mono text-sm rounded-lg">
                <code>{JSON.stringify(summary, null, 2)}</code>
              </pre>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

const defaultStory = `Once upon a time, in a faraway land, there lived a little girl named Alice. She was a curious and adventurous child who loved exploring the enchanted forest near her home. One day, while wandering through the forest, Alice stumbled upon a magical talking rabbit. The rabbit led her to a hidden treasure chest filled with sparkling jewels and golden coins. Excited by her discovery, Alice decided to share her newfound wealth with the less fortunate in her village. From that day on, Alice became known as the generous and kind-hearted girl who brought joy to everyone's lives.`;
