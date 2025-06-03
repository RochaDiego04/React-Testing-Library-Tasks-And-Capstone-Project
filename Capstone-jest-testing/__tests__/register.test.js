const library = require("../unitTestingTask.js");

describe("Register function", () => {
  it("should register a new formatter with valid name and format", () => {
    const mockFormatter = jest.fn().mockName("mockFormatter");

    const originalCreateFormatter = library.createFormatter;
    library.createFormatter = jest.fn(() => mockFormatter);

    const result = library.register("uppercase", "YYYY");

    expect(library._formatters.uppercase).toBe(mockFormatter);
    expect(library.createFormatter).toHaveBeenCalledWith("YYYY");
    expect(result).toBe(mockFormatter);

    library.createFormatter = originalCreateFormatter;
  });
});
