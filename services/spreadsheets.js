import moment from "moment";
import { GoogleSpreadsheet } from "google-spreadsheet";
import creds from "../client_secret.json";

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
  const sheet = doc.sheetsByIndex[0];

  /**
   * function to add rows to the sheet.
   * @function addRows
   * @param {Array<object>} tweets - Array of tweets
   * @returns {void}
   */
  const addRows = async (tweets) => {
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
        retweetCount
      } = tweet;

      await sheet.addRow({
        "Date (dd/mm/yyyy)": date,
        "Time (hhmm - 24hr format)": time,
        "Tweet Time": tweetTime,
        "Trend Hashtag": trendHashtag,
        "Tweet Volume": tweetVolume,
        "Tweet Text": tweetText,
        "Tweet Originator": username,
        "Tweet Originator follower count": followersCount,
        "Retweet Count": retweetCount
      });
    }
  };

  return { addRows };
}
