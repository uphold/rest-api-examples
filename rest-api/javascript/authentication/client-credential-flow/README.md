# Client credentials flow

This sample project demonstrates how to authenticate in the Uphold API using the client credentials flow. For further background, please refer to the [API documentation](https://uphold.com/en/developer/api/documentation).

## Summary

**Ideal for backend integrations** that do not require access to other Uphold user accounts.

This sample project performs the following actions:

- Get Token
- List Assets

**Important notice:** In Uphold's production environment, client credentials authentication is only available for **business accounts**, and requires manual approval from Uphold.
Please [contact Uphold](mailto:developer@uphold.com) to obtain this permission.
For applications that use the sandbox environment, as is the case with this demo project, those requirements can be skipped.

## Requirements

- `node` v13.14.0 +

## Setup

- run `npm install` (or `yarn install`)
- create a `.env` file based on the `.env.example` file, and populate it with the required data

## Run

- run `node index.js`
