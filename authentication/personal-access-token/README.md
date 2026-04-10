# Personal Access Token (PAT)

This sample project demonstrates how to authenticate in the Uphold API using a Personal Access Token (PAT).
For further background, please refer to the [API documentation](https://uphold.com/en/developer/api/documentation)

## Summary

**Ideal for scripts**, automated tools and command-line programs which remain under the control of your personal Uphold account.

This sample project performs the following actions:

- Obtain an OAuth access token using the client credentials grant
- Create a new PAT
- List all created PATs associated to this account

**Important notice:** If the account has two-factor authentication (2FA) active, a one-time-password (OTP) must be passed when creating PATs.
In the Sandbox environment, the special OTP value `000000` can be passed for convenience, as can be seen in the `index.js` file. In production, you would need to use an actual TOTP code provided by your chosen authenticator app (e.g. Google Authenticator).

**Note:** In Uphold's production environment, client credentials authentication is only available for **business accounts** and requires approval from Uphold.
Please [contact Uphold](mailto:developer@uphold.com) to obtain this permission.
For requests made in the sandbox environment, as is the case with this demo project, those requirements can be skipped.
If you are building a production integration for a personal account, you may need to use a different OAuth flow, such as `authorization_code`, instead of `client_credentials`.

## Requirements

- Node.js v13.14.0 or later
- An account at <https://sandbox.uphold.com>

## Setup

- Run `npm install` (or `yarn install`).
- [Create an app on Uphold Sandbox](https://sandbox.uphold.com/dashboard/profile/applications/developer/new) and note its client ID and secret.
- Create a `.env` file based on the `.env.example` file, and populate it with the required data.

## Run

- Run `node index.js`.
