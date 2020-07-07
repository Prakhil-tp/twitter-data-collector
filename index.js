import twitter from "./services/twitter";
import Sheet from "./services/spreadsheets";
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
    // console.log(JSON.stringify(tweets, undefined, 2));
    console.log(JSON.stringify(data[0].trends, undefined, 2));

    const sheet = await Sheet();
    sheet.addRows(data[0].trends);
  } catch (e) {
    console.log(e);
  }
})();
