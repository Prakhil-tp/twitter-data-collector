import { getUniqueShortTweetList } from "../trendsHelper";

describe("getUniqueShortTweetList", () => {
  test("return unique tweets", () => {
    const tweets = [
      { quoted_status: { id: 1 }, user: { followers_count: 2 } },
      { quoted_status: { id: 1 }, user: { followers_count: 1 } },
      { quoted_status: { id: 2 }, user: { followers_count: 1 } }
    ];
    const uniqueTweets = getUniqueShortTweetList(tweets, 3);
    expect(uniqueTweets.length).toBe(2);
    expect(uniqueTweets.includes(tweets[2])).toBeTruthy();
    expect(
      uniqueTweets.some((tweet) => tweet.quoted_status.id === 1)
    ).toBeTruthy();
  });

  test("limitable output tweets length", () => {
    const tweets = [
      { retweeted_status: { id: 1 }, user: { followers_count: 2 } },
      { retweeted_status: { id: 2 }, user: { followers_count: 2 } },
      { quoted_status: { id: 3 }, user: { followers_count: 1 } },
      { quoted_status: { id: 4 }, user: { followers_count: 1 } }
    ];

    const uniqueTweets = getUniqueShortTweetList(tweets, 3);
    expect(uniqueTweets.length).toBe(3);
  });

  test("return only tweets from tweeters having highest followers", () => {
    const tweets = [
      { retweeted_status: { id: 1 }, user: { followers_count: 2 } },
      { quoted_status: { id: 1 }, user: { followers_count: 1 } },
      { quoted_status: { id: 2 }, user: { followers_count: 1 } },
      { quoted_status: { id: 2 }, user: { followers_count: 5 } }
    ];
    const uniqueTweets = getUniqueShortTweetList(tweets, 4);
    expect(uniqueTweets.length).toBe(2);
    expect(uniqueTweets.includes(tweets[0])).toBeTruthy();
    expect(uniqueTweets.includes(tweets[3])).toBeTruthy();
  });
});
