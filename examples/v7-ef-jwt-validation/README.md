# JWT Verification using Edge Functions

https://edgio-community-examples-v7-ef-jwt-validation-live.glb.edgio.link/jwt

## Description

This repository provides example code for verifying JSON Web Tokens (JWT) using Edge Functions. It features an example of how to verify a JWT and return a 401 response if the token is invalid.

## Prerequisites

**NOTE**: To use this project, you must be an Edgio customer and signed up for the Edge Functions. See our [Edge Functions documentation](https://docs.edg.io/guides/v7/edge-functions) for information on activating this feature.

The system requirements include Node.js v16 or higher, and a UNIX-like system (Linux or macOS). The project code is written in JavaScript.

## Setup and Installation

1. Ensure you meet the prerequisites.
2. Clone the repository to your local machine.
3. Run `npm install` in the repository directory.

## Getting Started

After setting up the project, run `npm run edgio:dev` to start a local development server to test the example functions.

To deploy the project to Edgio, use the command `npm run edgio:deploy`. Note that deployment to Edgio requires you to be
logged into Edgio CLI which can be done via `npm run edgio login` and following the instructions.

## Known Issues and Limitations

Currently

* We only support JavaScript-based code
* Each request has a 60-second (wall time) timeout limit
* Each request is limited to 50ms of CPU time
* Each request is limited to 2MB of memory
* An Edgio Function can make fetch requests only to origins defined in your property configuration
  file (`edgio.config.js`).

Validating tokens signed with RSxxx, ESxxx, or PSxxx algorithms generally takes more processing power than is current available for Edge Functions. Please contact Edgio Support (below) to adjust the CPU and memory limits for your environment if you plan on validating these algorithms.

ESxxx algorithms use a very slow elliptical curve algorithm and may take longer than is allowed to validate, even with increased limits.

We're looking forward to feedback from our customers about these limitations and how we can improve the product.

## Support

If you have any queries or face issues with this project, please don't hesitate to contact
the [Edgio team](https://edg.io/contact-support/).

## License

[Creative Commons Attribution 4.0 International Public License](LICENSE-CONTENT) for the documentation.

[MIT License](LICENSE-CODE) for the code.
