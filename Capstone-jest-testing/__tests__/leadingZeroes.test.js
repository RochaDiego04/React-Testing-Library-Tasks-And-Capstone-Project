const library = require("../unitTestingTask.js");

describe("Leading Zeroes Functionality", () => {
  it("should pad with leading zeroes to the default length 2", () => {
    const result = library.leadingZeroes(5);
    expect(result).toBe("05");
  });

  it("should pad with leading zeroes to a custom length", () => {
    const result = library.leadingZeroes(4, 4);
    expect(result).toBe("0004");
  });

  it("should not pad value if it is longer than custom length", () => {
    const result = library.leadingZeroes(1234, 2);
    expect(result).toBe("1234");
  });
});
