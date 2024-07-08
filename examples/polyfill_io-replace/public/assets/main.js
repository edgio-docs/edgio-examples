document.addEventListener('DOMContentLoaded', (event) => {
  const codeBlock = document.createElement('pre');
  const codeContent = document.createElement('code');
  codeContent.className = 'language-html';
  codeContent.textContent = document.documentElement.outerHTML;
  codeBlock.appendChild(codeContent);
  codeBlock.className =
    'code-block bg-gray-900 text-gray-100 p-4 rounded mt-4 overflow-x-auto text-sm';

  const explanationParagraph = document.createElement('p');
  explanationParagraph.className = 'mt-4 text-base text-gray-600';
  explanationParagraph.textContent =
    'The code block below shows the current HTML document source after the edge function has processed it:';

  const lastParagraph = document.querySelector('body p:last-of-type');
  if (lastParagraph) {
    lastParagraph.insertAdjacentElement('afterend', explanationParagraph);
    explanationParagraph.insertAdjacentElement('afterend', codeBlock);
  } else {
    document.body.appendChild(explanationParagraph);
    document.body.appendChild(codeBlock);
  }

  Prism.highlightElement(codeContent);
});
