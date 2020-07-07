import config from "../config.json";
import Twit from "twit";

const T = new Twit(config);

/**
 * Thenable function to retrieve twitter trends.
 * @function getTrends
 * @param {string} id - `where on earth id` of location.(yahoo woeid)
 * @returns {Promise} - Promise or resolved/rejected value.
 */
const getTrends = (id) => {
  return new Promise((resolve, reject) => {
    T.get("trends/place", { id }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

/**
 * Thenable function to retrieve twitter tweets.
 * @function getTweets
 * @param {string} query - url query parameter to search tweets.
 * @returns {Promise} - Promise or resolved/rejected value.
 */
const getTweets = (query) => {
  return new Promise((resolve, reject) => {
    T.get("search/tweets", { q: query, count: 5 }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

export default {
  getTrends,
  getTweets
};
