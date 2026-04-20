/**
 * Dependencies.
 */

import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import {addJobToQueue, processJobs} from "./queues/transaction-queue.js";

// Dotenv configuration.
dotenv.config({path: path.resolve() + "/.env"});


/**
 * Format API error response for printing in console.
 */

export function formatError(error) {
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

    // Get the the first card with, at least 10 USD of available balance.
    return response.data.filter(card => {
      return Number(card.available) >= 10
    })[0];
  } catch (error) {
    formatError(error);
  }
}

/**
 * Queue 10 (default) transaction jobs from sourceAccountId to DESTINATION_EMAIL_ACCOUNT user.
 */

export async function queueAllJobs(sourceAccountID, numberOfJobs = 10) {
  try {


    // Destination account
    const destination = `${process.env.DESTINATION_EMAIL_ACCOUNT}`;

    // General job object
    const jobData = {
      data: {
        denomination: {
          amount: "0",
          currency: "USD",
        },
        destination
      },
      sourceAccountID
    }

    // Bull queue options. (https://github.com/OptimalBits/bull)
    // For this demo we will set a delay of 5 seconds before process and a retry limit of 3.
    // The timings used here are just for testing purposes, please read (https://uphold.com/en/developer/api/documentation/#rate-limits) to
    // implement timings in a real scenario
    const jobOptions = {
      delay: 5000,
      attempts: 3,
      lifo: true, //Last in First Out
      removeOnComplete: true, // Please update to your particular use case.
      removeOnFailed: true    // Please update to your particular use case.
    };

    // Just inject job transactions into the queue
    for (let i = 0; i < numberOfJobs; i++) {
      // Random value between 0.1 USD and 0.5 USD
      jobData.data.denomination.amount = (Math.random() * (0.5 - 0.1) + 0.1).toPrecision(3);

      // Add jobs to queue
      await addJobToQueue({...jobData}, jobOptions);
    }

  } catch (error) {
    formatError(error);
  }
}


/**
 * Process queued jobs
 */

export async function processQueuedJobs() {
  try {

    //Ok, lets process all transactions
    await processJobs();

    // Out!
    console.log("All done, thanks!");

  } catch (error) {
    formatError(error);
  }
}
