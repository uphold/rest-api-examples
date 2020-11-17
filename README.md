# API usage samples

This repository contains [minimal, self-contained, executable example projects](http://www.sscce.org/)
which demonstrate how to perform specific operations
using [Uphold's REST API](https://uphold.com/en/developer/api/documentation/).

> **Please note** that the examples contained here are optimized for clarity and simplicity.
> They are not meant to illustrate the coding style or structure that we'd recommend for production applications,
> but rather provide an entry point to start experimenting with Uphold's API.

## Usage

To try out each example, navigate to the corresponding folder and follow the instructions in the README.

The currently available examples are:

- Authentication
  - [OAuth: Client credentials flow](authentication/oauth-client-credentials/)
  - [OAuth: Authorization code flow](authentication/oauth-authorization-code/)
  - [Personal Access Token (PAT)](authentication/personal-access-token/)
- Transactions
  - [User-to-user transaction](transactions/user-to-user-transaction/)

## Contributing

Feel free to submit your own examples to this repository! Just make sure to follow the
[MRE](https://stackoverflow.com/help/minimal-reproducible-example)/[SSCCE](http://www.sscce.org/) principles,
and describe all steps to run the project in a README file similar to those of the current examples.

The contents of this repository are licensed under the [MIT license](LICENSE.txt).
