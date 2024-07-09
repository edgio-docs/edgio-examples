# Polyfill.io Replacement with Edge Functions

[https://edgio-community-examples-polyfill.io-replace-live.edgio.link/](https://edgio-community-examples-polyfill-io-replace-live.glb.edgio.link/)

## Description

This repository provides example code for transforming HTML content using Edge Functions. It includes a specific example of replacing polyfill.io script URLs with a different third-party CDN (cdnjs.cloudflare.com) to serve polyfills, enhancing security and performance. The code modifies the content using the `HtmlTransformer` class and streams responses to the transformer.

## Prerequisites

**NOTE**: To use this project, you must be an Edgio customer and signed up for the Edge Functions. See our [Edge Functions documentation](https://docs.edg.io/guides/v7/edge-functions) for information on activating this feature.

The system requirements include Node.js v18 or higher and a UNIX-like system (Linux or macOS). The project code is written in JavaScript.

## Setup and Installation

1. Ensure you meet the prerequisites.
2. Clone the repository to your local machine.
3. Run `npm install` in the repository directory.

## Getting Started

After setting up the project, run `npm run edgio:dev` to start a local development server to test the example functions.

To deploy the project to Edgio, use the command `npm run edgio:deploy`. Note that deployment to Edgio requires you to be
logged into Edgio CLI which can be done via `npm run edgio login` and following the instructions.

## Security Consideration

In light of recent discussions on potential supply chain attacks targeting polyfill services, it is crucial to mitigate the risks associated with relying on third-party scripts. By replacing polyfill.io URLs with those from a trusted CDN, this edge function helps protect your application from vulnerabilities that could be exploited through less secure or compromised content delivery networks.

## Support

If you have any queries or face issues with this project, please don't hesitate to contact
the [Edgio team](https://edg.io/contact-support/).

## License

[Creative Commons Attribution 4.0 International Public License](LICENSE-CONTENT) for the documentation.

[MIT License](LICENSE-CODE) for the code.
