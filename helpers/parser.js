/**
 * Helper function which returns array of url query strings
 * @param {Array} trends - response of twitter trends API
 * @returns {Array<string>} - returns fist 5 trends' query string as Array.
 */
const parseTopFiveQueries = (trends) => {
  if (trends instanceof Array && trends.length) {
    return trends.slice(0, 5).map((item) => item.query);
  }
  throw Error("Invalid input");
};

/**
 * Helper function which returns array of url query strings
 * @function getQueries
 * @param {Array} trends
 * @returns {Array<string>} - returns array query collected from the trends
 */
const parseQueries = (trends) => {
  if (trends instanceof Array && trends.length) {
    return trends.map((trend) => trend.query);
  }
  throw Error("Invalid input");
};

export default { parseTopFiveQueries, parseQueries };
