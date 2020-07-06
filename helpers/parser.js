/**
 * Helper function which returns array of url query strings
 * @param {object} trending - response of twitter trends API
 * @returns {Array<string>} - returns fist 5 trends' query string as Array.
 */
const parseTopFiveQueries = (trending) => {
  if (trending && trending instanceof Array) {
    const trends = trending[0] && trending[0].trends;
    return trends.slice(0, 5).map((item) => item.query);
  }
  throw Error("Invalid input");
};

export default { parseTopFiveQueries };
