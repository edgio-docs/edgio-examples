# JWT Verification using Edge Functions

This repository provides sample code for verifying JSON Web Tokens (JWT) using Edge Functions. The response varies according to whether it is able to verify the JWT.
-   **Valid JWT:** Returns the decoded JWT.
-   **Invalid JWT:** Returns a `401 Unauthorized` response.

Try it at:

https://edgio-community-examples-v7-ef-jwt-validation-live.glb.edgio.link/jwt

## Prerequisites

This JavaScript project requires:

-   An Edgio account.
-   Edge Functions activation. [Learn more about activation.](https://docs.edg.io/guides/v7/edge-functions)
-   Node.js v18 or higher
-   A UNIX-like system (Linux or macOS). 

## Setup and Installation

1. Ensure you meet the prerequisites.
2. Clone the repository to your local machine.
3. Run `npm install` in the repository directory.

## Getting Started

After setting up the project, run `npm run edgio:dev` to start a local development server to test.

To deploy the project to Edgio, use the command `npm run edgio:deploy`. Deploying to Edgio requires you to be
logged into Edgio CLI which can be done via `npm run edgio login` and the following the instructions.

## Known Issues and Limitations

Edge functions:

-   Must use JavaScript code.
-   May only submit fetch requests to origins defined within your property configuration
  file (`edgio.config.js`).

[View additional limitations.](https://docs.edg.io/applications/edge_functions#limitations)

Validating tokens signed with RSxxx, ESxxx, or PSxxx algorithms generally takes more processing power than is currently available for Edge Functions. [Contact Edgio support](https://edg.io/contact-support/) to adjust the CPU and memory limits for your environment if you plan on validating these algorithms.

ESxxx algorithms use a very slow elliptical curve algorithm and may take longer than is allowed to validate, even with increased limits.

## Support

If you have any queries or face issues with this project, [contact
us](https://edg.io/contact-support/).

## License

[Creative Commons Attribution 4.0 International Public License](LICENSE-CONTENT) for the documentation.

[MIT License](LICENSE-CODE) for the code.
