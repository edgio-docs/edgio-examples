# Next Auth Example

This app demonstrates how Layer0 could verify a JWT token created by NextAuth from Rust code running within Varnish.

## Getting Started

### 1. Clone the repository and install dependancies

```
git clone git@github.com:layer0-docs/next-auth-example.git
cd next-auth-example
yarn install
```

### 2. Configure your local environment

Create a file called ".env" in the root of this repo and paste in the contents from the 1Password secure note called "next-auth-example .env file" in the Moovweb/Platform Engineering vault.
Create a file called ".env.rust" in the root of this repo and paste in the contents from the 1Password secure note called "next-auth-example .env.rust file" in the Moovweb/Platform Engineering vault.

### 3. Start the application

To run your site locally, use:

```
0 dev
```

Then sign in with Google using your Layer0 email address.

### 4. Preparing for Production

You must set the `NEXTAUTH_URL` environment variable with the URL of your site, before deploying to production.

e.g. in your `.env.local` file - `NEXTAUTH_URL=https://example.com`
