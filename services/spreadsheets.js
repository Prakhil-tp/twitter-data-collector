import moment from "moment";
import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from "../client_secret.json";
import { delay } from "../helpers/apiHelper";

/**
 * Closure which serves functions related to sheet actions.
 * @returns {object} - object of functions
 */
export default async function () {
  const doc = new GoogleSpreadsheet(
    "1Oo5udsp58zhR9vjMzyLXtj3vEPl4e_Csn_gaSJSe_EU"
  );
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  console.log(`Sheet title: ${doc.title}`);

  /**
   * function to fetch params from the control sheet.
   * @function fetchControlParams
   * @returns {Array<object>} returns control key value pairs.
   */
  const fetchControlParams = async () => {
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
  };

  /**
   * function to add tweets to the sheet.
   * @function addRows
   * @param {Array<object>} tweets - Array of tweets
   * @returns {void}
   */
  const addRows = async (tweets) => {
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
  };

  return { addRows, fetchControlParams };
}
