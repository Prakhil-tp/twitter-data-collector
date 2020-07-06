import locations from "./locations";

describe("titleCase", () => {
  test("throw an error if called without argument", () => {
    expect(() => locations.titleCase()).toThrow(
      "title string argument is required"
    );
  });
  test("return title-cased title", () => {
    const title = "south africa";
    const titleCasedStr = locations.titleCase(title);
    expect(titleCasedStr).toBe("South Africa");
  });
});

describe("getWOEID", () => {
  test("return ID of country", () => {
    const woeidIndia = locations.getWOEID("india");
    expect(woeidIndia).toBe(23424848);
  });
  test("return ID of town in the country", () => {
    const woeidMumbai = locations.getWOEID("india", "mumbai");
    expect(woeidMumbai).toBe(2295411);
  });
  test("throw error if called without country parameter", () => {
    expect(() => locations.getWOEID()).toThrow(
      "Parameter country is required"
    );
  });
  test("throw error if called with wrong countryName", () => {
    expect(() => locations.getWOEID("wrong country")).toThrow(
      "country wrong country doesn't exist."
    );
  });
  test("throw error if called with wrong townName", () => {
    expect(() => locations.getWOEID("india", "wrong")).toThrow(
      "town wrong doesn't exist."
    );
  });
});
