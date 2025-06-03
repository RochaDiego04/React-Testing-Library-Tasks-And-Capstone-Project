const library = require("../unitTestingTask.js");

describe("Tokens Object functionality", () => {
  it("should return complete year when YYYY token", async () => {
    const result = library.tokens;
    expect(result.YYYY(new Date("December 17, 1995 03:24:00"))).toBe(1995);
  });

  it("should handle leading zeroes functionality and remainder for YY token", async () => {
    const result = library.tokens;
    expect(result.YY(new Date("December 17, 1995 03:24:00"))).toBe("95");
  });

  it("should return complete translated month when MMMM token", async () => {
    library.lang("en");

    const date = new Date("December 17, 1995 03:24:00");

    const result = library.tokens.MMMM(date);
    expect(result).toBe("December");
  });

  it("should return short translated month when MMM token", async () => {
    library.lang("en");

    const date = new Date("December 17, 1995 03:24:00");

    const result = library.tokens.MMM(date);
    expect(result).toBe("Dec");
  });

  it("should return month number when MM and if needed, add leading zeroes", async () => {
    const date = new Date("December 17, 1995 03:24:00");

    const result = library.tokens.MM(date);
    expect(result).toBe("12");
  });

  it("should return month number when M", async () => {
    const date = new Date("January 17, 1995 03:24:00");

    const result = library.tokens.M(date);
    expect(result).toBe(1);
  });

  it("should return translated weekday when token is DDD", async () => {
    library.lang("en");
    const date = new Date("January 17, 1995 03:24:00");

    const result = library.tokens.DDD(date);
    expect(result).toBe("Tuesday");
  });

  it("should return translated short weekday when token is DD", async () => {
    library.lang("en");
    const date = new Date("January 17, 1995 03:24:00");

    const result = library.tokens.DD(date);
    expect(result).toBe("Tue");
  });
  it("should return translated minimized weekday when token is DD", async () => {
    library.lang("en");
    const date = new Date("January 17, 1995 03:24:00");

    const result = library.tokens.D(date);
    expect(result).toBe("Tu");
  });

  it("should return day number when dd token is selected", async () => {
    const date = new Date("January 17, 1995 03:24:00");

    const result = library.tokens.d(date);
    expect(result).toBe(17);
  });

  it("should return day number when dd token is selected and if needed, add leading zeroes", async () => {
    const date = new Date("January 7, 1995 03:24:00");

    const result = library.tokens.dd(date);
    expect(result).toBe("07");
  });

  it("should return day number when d token is selected", async () => {
    const date = new Date("January 7, 1995 03:24:00");

    const result = library.tokens.d(date);
    expect(result).toBe(7);
  });

  it("should return hours number when HH token is selected and if needed, add leading zeroes", async () => {
    const date = new Date("January 7, 1995 03:24:00");

    const result = library.tokens.HH(date);
    expect(result).toBe("03");
  });

  it("should return hours number when H token is selected", async () => {
    const date = new Date("January 7, 1995 03:24:00");

    const result = library.tokens.H(date);
    expect(result).toBe(3);
  });

  it("should return hours in 12-hour format with leading zeroes when hh token is selected", async () => {
    const date = new Date("January 7, 1995 13:04:00");

    const result = library.tokens.hh(date);
    expect(result).toBe("01");
  });

  it("should return hours in 12-hour format when h token is selected", async () => {
    const date = new Date("January 7, 1995 13:04:00");

    const result = library.tokens.h(date);
    expect(result).toBe(1);
  });

  it("should return minutes with leading zeroes when mm token is selected", async () => {
    const date = new Date("January 7, 1995 13:04:00");

    const result = library.tokens.mm(date);
    expect(result).toBe("04");
  });

  it("should return minutes when m token is selected", async () => {
    const date = new Date("January 7, 1995 13:04:00");

    const result = library.tokens.m(date);
    expect(result).toBe(4);
  });

  it("should return seconds with leading zeroes when ss token is selected", async () => {
    const date = new Date("January 7, 1995 13:04:05");

    const result = library.tokens.ss(date);
    expect(result).toBe("05");
  });

  it("should return seconds when s token is selected", async () => {
    const date = new Date("January 7, 1995 13:04:07");

    const result = library.tokens.s(date);
    expect(result).toBe(7);
  });

  it("should return miliseconds with leading zeroes when ff token is selected", async () => {
    const date = new Date("January 7, 1995 13:04:07:003");

    const result = library.tokens.ff(date);
    expect(result).toBe("003");
  });

  it("should return miliseconds when f token is selected", async () => {
    const date = new Date("January 7, 1995 13:04:07:003");

    const result = library.tokens.f(date);
    expect(result).toBe(3);
  });

  it("should return uppercase meridiem (AM/PM) when A token is selected", async () => {
    library.lang("en");
    const date = new Date("January 7, 1995 13:04:07");

    const result = library.tokens.A(date);
    expect(result).toBe("PM");
  });

  it("should return lowercase meridiem (am/pm) when a token is selected", async () => {
    library.lang("en");
    const date = new Date("January 7, 1995 13:04:07");

    const result = library.tokens.a(date);
    expect(result).toBe("pm");
  });

  it("should return the timezone offset without a colon when ZZ token is selected", async () => {
    const date = new Date("January 7, 1995 13:04:07");

    const result = library.tokens.ZZ(date);
    expect(result).toBe("-0600");
  });

  it("should return the timezone offset with a colon when Z token is selected", async () => {
    const date = new Date("January 7, 1995 13:04:07");

    const result = library.tokens.Z(date);
    expect(result).toBe("-06:00");
  });
});
