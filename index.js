import twitter from "./services/twitter";
import Sheet from "./services/spreadsheets";
import locations from "./helpers/locations";
import {
  sortByRetweets,
  getFilteredTrends,
  getCleanedTweets
} from "./helpers/trendsHelper";

(async () => {
  try {
    const trendLimit = 30;
    const minTweetVolume = 1000;
    const displayTweetCount = 5;
    const tweetLimit = 500;
    const isIgnorePromotedContent = true;
    const isIgnoreTextTrend = false;

    const locationId = locations.getWOEID("india");
    const totalTrends = await twitter.getTrends(locationId);
    const trends = getFilteredTrends(
      totalTrends,
      trendLimit,
      minTweetVolume,
      isIgnorePromotedContent,
      isIgnoreTextTrend
    );

    // fetch tweets of every trends. [[...tweets],[...tweets]]
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
        const cleanedTweets = getCleanedTweets(shortTweetList, trend);
        return cleanedTweets;
      })
    );

    const mergedTweets = [].concat.apply([], trendsAndTweets);

    const sheet = await Sheet();
    sheet.addRows(mergedTweets);
  } catch (e) {
    console.log(e);
  }
})();
