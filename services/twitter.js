import dotenv from "dotenv";
import queryString from "query-string";
import Twit from "twit";
import log from "node-file-logger";
import options from "../logs/options.json";

dotenv.config();
log.SetUserOptions(options);

const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_TOKEN_SECRET
} = process.env;

const T = new Twit({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET,
  access_token: TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * Thenable function to retrieve twitter trends.
 * @function getTrends
 * @param {string} id - `where on earth id` of location.(yahoo woeid)
 * @returns {Promise} - Promise or resolved/rejected value.
 */
const getTrends = (id) => {
  return new Promise((resolve, reject) => {
    T.get("trends/place", { id }, (err, data) => {
      if (err) {
        log.Error(err.message, "twitterService", "getTrends", err);
        reject(err);
      }
      if (data && data.length && data[0].trends) {
        resolve(data[0].trends);
      } else resolve([]);
    });
  });
};

/**
 * Helper function to search tweets
 * @function fetchTweets
 * @param {object} params - search parameters
 * @return {Promise} - twitter API response.
 */
const fetchTweets = (params) => {
  return new Promise((res, rej) => {
    T.get("search/tweets", params, (err, data) => {
      if (err) {
        log.Error(err.message, "twitterService", "fetchTweets", err);
        rej(err);
      } else res(data);
    });
  });
};

/**
 * Thenable function to retrieve twitter tweets.
 * @function getTweets
 * @param {string} query - url query parameter to search tweets.
 * @param {maxTweetCount} - maximum tweets needed to analyze.
 * @returns {Promise} - Resolved value : Array of tweets
 */
const getTweets = async (query, maxTweetCount = 100) => {
  try {
    let tweetsToFetch = maxTweetCount;
    let params = { q: query, count: 100 };
    const tweets = [];

    while (tweetsToFetch > 0) {
      const tweetData = await fetchTweets(params);
      if (tweetData.statuses.length) {
        tweets.push(...tweetData.statuses);
        tweetsToFetch -= tweetData.statuses.length; // Decrementing `tweetsToFetch` with tweets' length of every fetch.

        const nextFetchQuery = queryString.parse(
          tweetData.search_metadata.next_results
        );

        params.count = tweetsToFetch < 100 ? tweetsToFetch : 100;
        params.max_id = nextFetchQuery.max_id;
      } else break;
    }
    return tweets;
  } catch (e) {
    log.Fatal(e.message, "twitterService", "getTweets", e);
  }
};

export default {
  getTrends,
  getTweets
};
