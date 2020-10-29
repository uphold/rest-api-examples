# User-to-user transaction

This sample project demonstrates how to perform a transaction from one Uphold user to another,
with the latter identified by their email address.
For further background, please refer to the [API documentation](https://uphold.com/en/developer/api/documentation).

## Summary

This sample project performs the following actions:

- Create and commit a transaction
- Display the data about the transaction

## Requirements

- Node.js v13.14.0 or later
- An account at <https://sandbox.uphold.com> with at least $1 USD of available funds
- An access token from that account, to perform authenticated requests to the Uphold API
  (see the [authentication](../../authentication) examples for how to obtain one)

## Setup

- Run `npm install` (or `yarn install`)
- Create a `.env` file based on the `.env.example` file, and populate it with the required data.

## Run

Run `node index.js`.

The code will locate a card with nonzero balance in the source account, and prepare a $1 USD transaction
from that card to the account identified by the email in the `.env` file.

The result will depend on the status of the destination email:

- If it is already associated with an existing Sandbox account, the transaction will be completed immediately
  and the funds will become available in the recipient's account.
- If no Sandbox account exists with that email, an "invite"-type transaction will be created,
  which will be executed when the associated account is created.
  This invite can be cancelled by the sender while the recipient hasn't registered
  (which is useful if you use a dummy email address for this).
