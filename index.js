import twitter from "./services/twitter";
import Sheet from "./services/spreadsheets";
import locations from "./helpers/locations";
import {
  sortByRetweets,
  getFilteredTrends,
  getCleanedTweets
} from "./helpers/trendsHelper";

/**
 * Immediately Invoked function expression (IIFE)
 * Trigger point
 */
(async () => {
  try {
    const sheet = await Sheet();
    const controls = await sheet.fetchControlParams();

    const {
      MaxNoOfTrends: trendLimit,
      MinTweetVolume: minTweetVolume,
      MaxTweetsPerTrend: displayTweetCount,
      MaxTweetsToBeAnalyzed: tweetLimit,
      TrendCountry: trendCountry,
      TrendCity: trendCity,
      IgnorePromotedContent: isIgnorePromotedContent,
      IgnoreTextTrend: isIgnoreTextTrend
    } = controls;

    const locationId = locations.getWOEID(trendCountry, trendCity);
    const totalTrends = await twitter.getTrends(locationId);
    const trends = getFilteredTrends(
      totalTrends,
      trendLimit,
      minTweetVolume,
      isIgnorePromotedContent,
      isIgnoreTextTrend
    );

    /**
     * Fetch tweets of every trends.
     * returns [[...tweets],[...tweets]]
     */
    const trendsAndTweets = await Promise.all(
      trends.map(async (trend) => {
        const tweetList = await twitter.getTweets(
          trend.query,
          tweetLimit
        );
        const sortedTweets = sortByRetweets(tweetList);
        const shortTweetList = sortedTweets.slice(
          0,
          displayTweetCount - 1
        );
        return getCleanedTweets(shortTweetList, trend);
      })
    );
    const mergedTweets = [].concat.apply([], trendsAndTweets);

    sheet.addRows(mergedTweets);
  } catch (e) {
    console.log(e);
  }
})();
