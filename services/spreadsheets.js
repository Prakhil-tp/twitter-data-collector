import dotenv from "dotenv";
import moment from "moment";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { delay } from "../helpers/apiHelper";
import log from "node-file-logger";
import options from "../logs/options.json";

dotenv.config();
log.SetUserOptions(options);

/**
 * Closure which serves functions related to sheet actions.
 * @returns {object} - object of functions
 */
export default async function () {
  const {
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    GOOGLE_SHEET_ID
  } = process.env;

  const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY
  });

  await doc.loadInfo();
  console.log(`Sheet title: ${doc.title}`);

  /**
   * function to fetch params from the control sheet.
   * @function fetchControlParams
   * @returns {Array<object>} returns control key value pairs.
   */
  const fetchControlParams = async () => {
    try {
      const sheet = doc.sheetsByIndex[1];
      const rows = await sheet.getRows();
      const controls = {};
      rows.forEach(({ CONTROL, VALUE }) => {
        if (isNaN(VALUE)) {
          if (
            CONTROL === "IgnorePromotedContent" ||
            CONTROL === "IgnoreTextTrend"
          ) {
            VALUE = VALUE === "t" ? true : false;
          }
          controls[CONTROL] = VALUE;
          return;
        }
        controls[CONTROL] = parseInt(VALUE);
      });
      return controls;
    } catch (e) {
      log.Fatal(e.message, "spreadsheets", "fetchControlParams", e);
    }
  };

  /**
   * function to add tweets to the sheet.
   * @function addRows
   * @param {Array<object>} tweets - Array of tweets
   * @returns {void}
   */
  const addRows = async (tweets) => {
    try {
      const sheet = doc.sheetsByIndex[0];
      const now = moment();
      const date = now.format("DD/MM/YYYY");
      const time = now.format("HHmm");

      for (let tweet of tweets) {
        const {
          tweetTime,
          trendHashtag,
          tweetVolume,
          tweetText,
          username,
          followersCount,
          retweetCount,
          originator,
          originatorFollowersCount
        } = tweet;

        await delay(20);
        await sheet.addRow({
          "Date (dd/mm/yyyy)": date,
          "Time (hhmm - 24hr format)": time,
          "Tweet Time": tweetTime,
          "Trend Hashtag": trendHashtag,
          "Tweet Volume": tweetVolume,
          "Tweet Text": tweetText,
          Tweeter: username,
          "Tweeter follower count": followersCount,
          "Tweet Originator": originator,
          "Tweet Originator follower count": originatorFollowersCount,
          "Retweet Count": retweetCount
        });
      }
    } catch (e) {
      log.Fatal(e.message, "spreadsheets", "addRows", e);
    }
  };

  return { addRows, fetchControlParams };
}
