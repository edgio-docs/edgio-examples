const template = ({ requestUrl }) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waiting Room Demo</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            line-height: 1.4;
            font-size: 1rem;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            padding: 2rem;
            display: grid;
            place-items: center;
            min-height: 100vh;
            background-color: #f3f4f6;
            color: #333;
        }

        pre {
          display: inline;
        }

        .container {
            width: 100%;
            max-width: 800px;
            text-align: center;
            background-color: #fff;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        p {
            margin-top: .5rem;
        }

        a {
            color: #3498db;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        h1 {
            margin-bottom: 20px;
        }

        .code-block {
            display: block;
            width: 100%;
            padding: 15px;
            margin: 20px 0;
            background-color: #d0d0d0;
            border-radius: 5px;
            overflow-x: auto;
            white-space: pre;
            font: 1rem monospace;
        }

        .copy-btn {
            padding: 8px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background-color: #3498db;
            color: #fff;
            margin: 10px 0;
        }

    </style>
    <script>
        function copyCodeToClipboard() {
            const codeBlock = document.querySelector(".code-block");
            const textarea = document.createElement("textarea");
            textarea.textContent = codeBlock.textContent;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
        }

        function keepSessionAlive() {
            fetch('${requestUrl}/ping');
        }

        // Set interval to keep session alive every 15 seconds
        setInterval(keepSessionAlive, 15000);
    </script>
</head>

<body>
    <div class='container'>
      <h1>Welcome to the Waiting Room Demo</h1>
      <Here>This demo showcases an effective way to manage website traffic during high-volume periods. When the site is at full capacity, visitors are temporarily placed in a waiting room, ensuring a smooth user experience. Here's how it works:</p>
      
      <p>
          If you see this page, you have established a session as an active user since the session limit has not been reached.
      </p>
      <p>
          <strong>To simulate creating new sessions, issue the following command:</strong>
          <div class="code-block">for i in {1..5}; do curl ${requestUrl}; done</div>
          <button class="copy-btn" onclick="copyCodeToClipboard()">Copy Code</button>
      </p>
      <p>
          <strong>To start a new session which is queued,</strong> follow these instructions:
          <p>Open the link in a new private/incognito window: <a href="${requestUrl}" target="_blank">Start New Session</a>. This will attempt to establish a new session, which will be queued if the active session limit is reached.</p>
      </p>

      <p>Dive into the code to see how it works.</p>
      <p><a href="https://github.com/edgio-docs/edgio-v7-edge-functions-example" target="_blank">View the demo code on GitHub</a></p>
  </div>

</body>

</html>
`;

export default template;
