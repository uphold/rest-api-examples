/**
 * Dependencies.
 */

import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// Dotenv configuration.
dotenv.config({ path: path.resolve() + "/.env" });

/**
 * Create and commit a transaction.
 */

export async function createAndCommitTransaction(data = {}, myCardID = null) {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "content-type": "application/json",
    },
    data,
    url: `${process.env.BASE_URL}/v0/me/cards/${myCardID}/transactions?commit=true`,
  };

  const response = axios(options)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.response.data.errors
        ? console.log(JSON.stringify(error.response.data.errors, null, 2).error)
        : console.log(JSON.stringify(error, null, 2).error);
      throw error;
    });

  return response;
}

/**
 * Get the first card with available balance (if one exists).
 */

export async function getCardWithFunds() {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/v0/me/cards`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    // Get the the first card with nonzero available balance.
    return response.data.filter(card => {
      return Number(card.available) > 0
    })[0];
  } catch (error) {
    error.response.data.errors
      ? console.log(JSON.stringify(error.response.data.errors, null, 2).error)
      : console.log(JSON.stringify(error, null, 2).error);
    throw error;
  }
}
