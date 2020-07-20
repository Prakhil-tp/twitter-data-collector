/**
 * Helper function to sort tweets by descending order of retweets count
 * @function sortByRetweets
 * @param {Array<object} tweetList - array of tweets
 * @returns {Array<object>} - returns sorted tweets array.
 */
const sortByRetweets = (tweetList) => {
  return tweetList.sort((a, b) => {
    return b.retweet_count - a.retweet_count;
  });
};

/**
 * Helper function to filter trends with params.
 * @function getFilteredTrends
 * @param {Array<object>} trendList - array of trends
 * @param {number} trendLimit - no.of trends to be fetched.
 * @param {number} minTweetVolume
 * @param {boolean} isIgnorePromotedContent
 * @param {boolean} isIgnoreTextTrend - ignore trends without having '#'
 * @returns {Array<object>} - returns filtered array.
 */
const getFilteredTrends = (
  trendList,
  trendLimit,
  minTweetVolume,
  isIgnorePromotedContent,
  isIgnoreTextTrend
) => {
  const filteredTrends = trendList.filter((trend) => {
    if (isIgnorePromotedContent && isIgnoreTextTrend) {
      return (
        trend.tweet_volume >= minTweetVolume &&
        !trend.promoted_content &&
        trend.name.charAt(0) === "#"
      );
    } else if (isIgnorePromotedContent) {
      return (
        trend.tweet_volume >= minTweetVolume &&
        !trend.promoted_content
      );
    } else if (isIgnoreTextTrend) {
      return (
        trend.tweet_volume >= minTweetVolume &&
        trend.name.charAt(0) === "#"
      );
    }
    return trend.tweet_volume >= minTweetVolume;
  });
  const count = filteredTrends.length;
  const limit = count < trendLimit ? count : trendLimit;

  if (limit) {
    const sortedList = filteredTrends.sort((a, b) => {
      return b.tweet_volume - a.tweet_volume;
    });
    return sortedList.slice(0, limit);
  }
  return [];
};

/**
 * Helper function to clean up tweets Array of object.
 * create tweet object with necessary properties.
 * @function getCleanedTweets
 * @param {Array<object>} tweets - tweets to clean up.
 * @param {object} trends - trend of tweets.
 * @returns {Array<object>} - returns cleaned tweets array
 */
const getCleanedTweets = (tweets, trend) => {
  return tweets.map((tweet) => {
    const {
      created_at: tweetTime,
      text: tweetText,
      retweet_count: retweetCount,
      user: {
        screen_name: username,
        followers_count: followersCount
      },
      retweeted_status: {
        user: {
          screen_name: originator,
          followers_count: originatorFollowersCount
        }
      } = { user: { screen_name: "", followers_count: "" } }
    } = tweet;

    return {
      tweetTime,
      trendHashtag: trend.name,
      tweetVolume: trend.tweet_volume,
      tweetText,
      username,
      followersCount,
      originator,
      originatorFollowersCount,
      retweetCount
    };
  });
};

/**
 * Helper function to get only one retweet from the original tweet.
 * @function getUniqueShortTweetList
 * @param {Array<object>} tweets - tweets & retweets (sorted By retweets)
 * @param {number} limit - number of tweets to return.
 * @returns {Array<object>} - Single tweet from an originator.
 */
const getUniqueShortTweetList = (tweets, limit) => {
  const blackList = [];
  const uniqueTweets = [];

  tweets.forEach((tweet) => {
    const { retweeted_status } = tweet;

    if (retweeted_status) {
      const isInBlacklist = blackList.some((originalTweetId) => {
        return retweeted_status.id === originalTweetId;
      });
      if (isInBlacklist) return;
      blackList.push(retweeted_status.id);
    }
    uniqueTweets.push(tweet);
  });
  return uniqueTweets.slice(0, limit - 1);
};

export {
  sortByRetweets,
  getFilteredTrends,
  getCleanedTweets,
  getUniqueShortTweetList
};
