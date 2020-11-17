# Client credentials OAuth flow

This sample project demonstrates how to authenticate in the Uphold API using the [OAuth 2.0 client credentials](https://oauth.net/2/grant-types/client-credentials/) flow.
For further background, please refer to the [API documentation](https://uphold.com/en/developer/api/documentation).

## Summary

**Ideal for backend integrations** that do not require access to other Uphold user accounts.

This sample project performs the following actions:

- Obtain an access token using client credentials authentication
- Perform an API request (list assets) using the token

**Important notice:** In Uphold's production environment, client credentials authentication is only available for **business accounts**, and requires manual approval from Uphold.
Please [contact Uphold](mailto:developer@uphold.com) to obtain this permission.
For requests made in the sandbox environment, as is the case with this demo project, those requirements can be skipped.

## Requirements

- Node.js v13.14.0 or later
- An account at <https://sandbox.uphold.com>

## Setup

- Run `npm install` (or `yarn install`)
- [Create an app on Uphold Sandbox](https://sandbox.uphold.com/dashboard/profile/applications/developer/new) and note its client ID and secret
- Create a `.env` file based on the `.env.example` file, and populate it with the required data

## Run

- Run `node index.js`
