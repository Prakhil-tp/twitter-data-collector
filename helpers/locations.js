import locationList from "./locationList.json";

/**
 * Helper function to make string as title case.
 * @function titleCase
 * @param {string} title - string to make title case
 * @returns {string} - title cased string
 */
const titleCase = (title) => {
  if (title) {
    const text = title.trim();
    const wordList = text.split(" ");
    const titleCasedString = wordList
      .map((word) => {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(" ");
    return titleCasedString;
  }
  throw Error("title string argument is required");
};

/**
 * Function to get `Yahoo Where on earth id` of country or town
 * @function getWOEID
 * @param {string} countryName - name of the country.
 * @param {string} townName - town in the country.
 * @returns {Number} - WOEID
 */
const getWOEID = (countryName, townName = "") => {
  if (countryName) {
    const countryTitle = titleCase(countryName);
    const country = locationList.find(
      (location) => location.name === countryTitle
    );
    if (country && townName) {
      const townTitle = titleCase(townName);
      const town = locationList.find(
        (location) =>
          location.name === townTitle &&
          location.parentid === country.woeid
      );
      if (town) return town.woeid;
    }
    if (country) return country.woeid;
    throw Error(`country ${countryName} doesn't exist.`);
  }
  throw Error("Parameter country is required!");
};

export default { getWOEID, titleCase };
