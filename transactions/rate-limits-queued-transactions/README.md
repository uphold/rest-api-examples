# Rate-limits-queued transaction

This sample project demonstrates how to perform several transactions from one Uphold user to another,
with the latter identified by their email address.
For further background, please refer to the [API documentation](https://uphold.com/en/developer/api/documentation).

This example makes use of [Bull queue management system](https://github.com/OptimalBits/bull)

## Summary

This code it's **NOT PRODUCTION READY** and is only an example, and we are assuming that:
- 2FA  is disabled.

This sample project performs the following actions:

- Create and commit multiple, random value (.1 USD ~ .5 USD) transactions using a queue system.
- Display the data about each transaction

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop) for Mac or Windows.
- [Docker Compose](https://docs.docker.com/compose) will be automatically installed. On Linux, make sure you have the latest version of [Compose](https://docs.docker.com/compose/install/).
- Node.js v13.14.0 or later
- An account at <https://sandbox.uphold.com> with at least $10 USD of available test funds
- An access token from that account, to perform authenticated requests to the Uphold API
  (see the [authentication](../../authentication) examples for how to obtain one)

## Setup Redis

- Bull needs the [Redis](https://redis.io/) service to store and manage jobs and messages:
  You can set up redis service using `docker-compose`

```bash   
   docker-compose -f docker-compose.yml up -d
```

## Setup sample

- Run `npm install` (or `yarn install`)
- Create a `.env` file based on the `.env.example` file, and populate it with the required data.

## Run

Run `node index.js`.

The code will locate a card with nonzero balance in the source account, and prepare multiple random USD transactions
from that card to the account identified by the email in the `.env` file.

The result will depend on the status of the destination email:

- If it is already associated with an existing Sandbox account, the transaction will be completed immediately, and the funds will become available in the recipient's account.
- If no Sandbox account exists with that email, an "invite"-type transaction will be created,
  which will be executed when the associated account is created.
  This invite can be cancelled by the sender while the recipient hasn't registered
  (which is useful if you use a dummy email address for this).
