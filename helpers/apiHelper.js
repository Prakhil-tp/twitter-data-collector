/**
 * Helper function to make delay for rate limited APIs.
 * @function delay
 * @param {number} interval
 */
const delay = (interval) => {
  return new Promise((resolve) => setTimeout(resolve, interval));
};

export { delay };
