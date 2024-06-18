# S3 Request Signing Example

https://edgio-community-examples-v7-aws-s3-request-signing-live.glb.edgio.link/

## Description

This repository provides example code for signing requests to an S3 origin using AWS v4 signature algorithm with Edge Functions. It demonstrates how to handle requests using a router and forward them to an S3 bucket with proper authentication.

## Prerequisites

**NOTE**: To use this project, you must be an Edgio customer and signed up for the Edge Functions. See our [Edge Functions documentation](https://docs.edg.io/guides/v7/edge-functions) for information on activating this feature.

The system requirements include Node.js v18 or higher, and a UNIX-like system (Linux or macOS). The project code is written in JavaScript.

## Setup and Installation

1. Ensure you meet the prerequisites.
2. Clone the repository to your local machine.
3. Run `npm install` in the repository directory.

## Environment Variables

The following environment variables need to be set for the edge function to authenticate and sign requests correctly:

- `S3_HOSTNAME`: The S3 bucket hostname.
- `S3_REGION`: The AWS region where the S3 bucket is located.
- `S3_ACCESS_KEY_ID`: Your AWS access key ID.
- `S3_SECRET_ACCESS_KEY`: Your AWS secret access key.

When running the project locally, these variables can be defined in a `.env` file or directly in the environment. For deployment on Edgio, these should be set in the Edgio Developer Console.

## Getting Started

After setting up the project, run `npm run edgio:dev` to start a local development server to test the example functions.

To deploy the project to Edgio, use the command `npm run edgio:deploy`. Note that deployment to Edgio requires you to be logged into Edgio CLI which can be done via `npm run edgio login` and following the instructions.

## Support

If you have any queries or face issues with this project, please don't hesitate to contact the [Edgio team](https://edg.io/contact-support/).

## License

[Creative Commons Attribution 4.0 International Public License](LICENSE-CONTENT) for the documentation.

[MIT License](LICENSE-CODE) for the code.
