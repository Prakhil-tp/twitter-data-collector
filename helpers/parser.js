const parseTopFiveQueries = (trending) => {
  if (trending && trending instanceof Array) {
    const trends = trending[0] && trending[0].trends;
    return trends.slice(0, 5).map((item) => item.query);
  }
  throw Error("Invalid input");
};

export default { parseTopFiveQueries };
