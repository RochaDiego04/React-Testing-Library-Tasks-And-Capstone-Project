const library = require("../unitTestingTask.js");

describe("Languages Functionality", () => {
  it("languages should start with proper configuration", async () => {
    const result = library.languages;
    expect(result).toMatchObject({
      current: "en",
      en: expect.objectContaining({
        _months: expect.any(Array),
        weekdays: expect.any(Array),
        meridiem: expect.any(Function),
      }),
    });
  });

  it("should return current language by default if not provided", () => {
    const result = library.lang();
    expect(result).toBe("en");
  });

  it("should switch to an existing language when provided", () => {
    library.lang("fr", {});
    library.lang("en");
    const result = library.lang("fr");
    expect(result).toBe("fr");
    expect(library.lang()).toBe("fr");
  });

  it("should load a new language from module if not present", () => {
    jest.doMock(
      "./lang/fr",
      () => ({
        _months: ["Janvier", "Février"],
      }),
      { virtual: true }
    );

    const result = library.lang("fr");
    expect(result).toBe("fr");
    expect(library.lang()).toBe("fr");
  });
});
