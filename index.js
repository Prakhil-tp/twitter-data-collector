import twitter from "./twitterService";
import locations from "./helpers/locations";
import parser from "./helpers/parser";

(async () => {
  try {
    const locationId = locations.getWOEID("india");
    const data = await twitter.getTrends(locationId);
    const queries = parser.parseTopFiveQueries(data);

    const tweetsData = await twitter.getTweets(queries[0]);
    const tweets = tweetsData && tweetsData.statuses;

    // console.log(tweets);
    // tweets.forEach((tweet) => {
    // console.log(tweet.text);
    // });
    console.log(JSON.stringify(tweets, undefined, 2));
    // console.log(JSON.stringify(data, undefined, 2));
  } catch (e) {
    console.log(e);
  }
})();
