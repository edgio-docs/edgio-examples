const template = () => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv='refresh' content='5'>
    <title>Waiting Room</title>
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

        .loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        h1 {
            margin-top: 20px;
            margin-bottom: 20px;
        }

    </style>
</head>

<body>
    <div class='container'>
        <div class="loader"></div>
        <h1>Almost There!</h1>
        <p>Our site is currently at full capacity. Thanks for your patience.</p>
        <p>You'll be redirected shortly. Please do not close your browser.</p>
    </div>
</body>

</html>
`;

export default template;
