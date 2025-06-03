const library = require("../unitTestingTask.js");

describe("Date Formatting Function", () => {
  it("should format date with provided format", () => {
    const result = library.unitTestingTaskFunction(
      "d MMMM",
      new Date("December 17, 1995 03:24:00")
    );
    expect(result).toBe("17 December");
  });

  it("should format date passed as string", () => {
    const result = library.unitTestingTaskFunction(
      "MMMM d, h:mma",
      "December 17, 1995 03:24:00"
    );
    expect(result).toBe("December 17, 3:24am");
  });
});
