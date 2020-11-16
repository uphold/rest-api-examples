# Client credentials PAT

This sample project demonstrates how to authenticate in the Uphold API using a Personal Access Token (PAT).
For further background, please refer to the [API documentation](https://uphold.com/en/developer/api/documentation)

## Summary

**Ideal for scripts**, automated tools and command-line programs which remain under the control of your personal Uphold account.

This sample project performs the following actions:

- Create a new PAT
- List all created PATs associated to this account

**Important notice:** If the account has two-factor authentication (2FA) active, a one-time-password (OTP) must be passed when creating PATs.
In the Sandbox environment, the special OTP value `000000` can be passed for convenience, as can be seen in the `index.js` file. In production, you would need to use an actual TOTP code provided by your chosen authenticator app (e.g. Google Authenticator).

## Requirements

- Node.js v13.14.0 or later

## Setup

- Run `npm install` (or `yarn install`)
- Create a `.env` file based on the `.env.example` file, and populate it with the required data

## Run

- Run `node index.js`
