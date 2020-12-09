/**
 * Dependencies.
 */

import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// Dotenv configuration.
dotenv.config({ path: path.resolve() + "/.env" });

/**
 * Format API error response for printing in console.
 */

function formatError(error) {
  const responseStatus = `${error.response.status} (${error.response.statusText})`;

  console.log(
    `Request failed with HTTP status code ${responseStatus}`,
    JSON.stringify({
      url: error.config.url,
      response: error.response.data
    }, null, 2)
  );

  throw error;
}

/**
 * Create and commit a 1 USD transaction from a specific card.
 */

export async function createAndCommitTransaction(sourceCardID = null) {
  try {
    const response = await axios.request({
      method: "POST",
      url: `${process.env.BASE_URL}/v0/me/cards/${sourceCardID}/transactions?commit=true`,
      data: {
        denomination: {
          amount: "1",
          currency: "USD",
        },
        destination: `${process.env.DESTINATION_EMAIL_ACCOUNT}`,
      },
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "content-type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    formatError(error);
  }
}

/**
 * Get the first card with available balance (if one exists).
 */

export async function getCardWithFunds() {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${process.env.BASE_URL}/v0/me/cards`,
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    // Get the the first card with nonzero available balance.
    return response.data.filter(card => {
      return Number(card.available) > 0
    })[0];
  } catch (error) {
    formatError(error);
  }
}
