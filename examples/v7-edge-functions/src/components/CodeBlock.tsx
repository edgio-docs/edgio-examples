'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark as style } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clipboardCopy from 'clipboard-copy';
import { FiCopy } from 'react-icons/fi';
import React from 'react';

const CodeHeader = ({ language, filename, onCopy }) => (
  <div className={`text-sm text-gray-400 p-2 flex justify-between border-b`}>
    <span className="text-left">
      {language.toUpperCase()} {filename && ` - ${filename}`}
    </span>
    <button
      onClick={onCopy}
      style={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: 'white',
      }}
    >
      <FiCopy size={20} />
    </button>
  </div>
);

const PreTag = ({ children, ...props }) => {
  return (
    <div
      className={`rounded-lg border`}
      style={{ background: props.style.background }}
    >
      {/* <CodeHeader {...props} /> */}
      <pre {...props}>{children}</pre>
    </div>
  );
};

const CodeBlock = ({ language, filename, value }) => {
  const handleCopy = () => {
    clipboardCopy(value);
  };

  return (
    <SyntaxHighlighter
      language={language}
      style={style}
      PreTag={(props) => (
        <PreTag
          {...props}
          language={language}
          filename={filename}
          onCopy={handleCopy}
        />
      )}
      showLineNumbers
    >
      {value.trim()}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
