import { mergeAllSettings } from "./block.util";

describe("BlockUtil", () => {
  it("should merge objects if new object is empty", () => {
    const oldSett = {
      conf: { t: "foo", b: "test", ver: { w: "w", d: "g" } },
      enabled: true,
      versions: { a: "a", x: "" },
      settings: {
        a: "a",
        b: "b",
      },
    };
    const newSett = {};
    const results = mergeAllSettings(oldSett, newSett);
    expect(results).toEqual(oldSett);
  });

  it("should keep old value if primitive key not exists", () => {
    const oldSett = {
      conf: { t: "foo", b: "test", ver: { w: "w", d: "g" } },
      enabled: true,
      versions: { a: "a", x: "" },
      settings: {
        a: "a",
        b: "b",
      },
    };
    const newSett = {
      conf: { t: "boo", c: "lest", ver: { g: "w", n: "g" } },
      versions: [3, 1, 2],
      settings: {
        l: "bla",
        c: "gra",
      },
    };

    const results = mergeAllSettings(oldSett, newSett, ["settings"]);
    expect(results).toEqual({
      conf: {
        t: "boo",
        c: "lest",
        ver: { g: "w", n: "g", w: "w", d: "g" },
        b: "test",
      },
      versions: [3, 1, 2],
      settings: { l: "bla", c: "gra" },
      enabled: true,
    });
  });

  it("should run over value if primitive key exists", () => {
    const oldSett = {
      conf: { t: "foo", b: "test", ver: { w: "w", d: "g" } },
      enabled: true,
      versions: { a: "a", x: "" },
      settings: {
        a: "a",
        b: "b",
      },
    };

    const newSett = {
      conf: { t: "boo", c: "lest", ver: { g: "w", n: "g" } },
      enabled: false,
      versions: [3, 1, 2],
      settings: {
        l: "bla",
        c: "gra",
      },
    };
    const results = mergeAllSettings(oldSett, newSett, ["settings"]);
    expect(results).toEqual({
      conf: {
        t: "boo",
        c: "lest",
        ver: { g: "w", n: "g", w: "w", d: "g" },
        b: "test",
      },
      enabled: false,
      versions: [3, 1, 2],
      settings: { l: "bla", c: "gra" },
    });
  });

  it("should keep old value if key not exists on new object", () => {
    const oldSett = {
      conf: { t: "foo", b: "test", ver: { w: "w", d: "g" } },
      enabled: true,
      versions: { a: "a", x: "" },
      settings: {
        a: "a",
        b: "b",
      },
    };

    const newSett = {
      conf: { t: "boo", c: "lest", ver: { g: "w", n: "g" } },
      enabled: false,
      versions: [3, 1, 2],
    };
    const results = mergeAllSettings(oldSett, newSett, ["settings", "ver"]);
    expect(results).toEqual({
      conf: { t: "boo", c: "lest", ver: { g: "w", n: "g" }, b: "test" },
      enabled: false,
      versions: [3, 1, 2],
      settings: { a: "a", b: "b" },
    });
  });

  it("should run over value if key exists on new object and keysToNotMerge include key", () => {
    const oldSett = {
      conf: { t: "foo", b: "test", ver: { w: "w", d: "g" } },
      enabled: true,
      versions: { a: "a", x: "" },
      settings: {
        a: "a",
        b: "b",
      },
    };

    const newSett = {
      conf: { t: "boo", c: "lest", ver: { g: "w", n: "g" } },
      enabled: false,
      versions: [3, 1, 2],
      settings: {
        l: "bla",
        c: "gra",
      },
    };
    const results = mergeAllSettings(oldSett, newSett, ["settings", "ver"]);
    expect(results).toEqual({
      conf: { t: "boo", c: "lest", ver: { g: "w", n: "g" }, b: "test" },
      enabled: false,
      versions: [3, 1, 2],
      settings: { l: "bla", c: "gra" },
    });
  });

  it("should merge nested objects key if keysToNotMerge does not include key", () => {
    const oldSett = {
      conf: { t: "foo", b: "test", ver: { w: "w", d: "g" } },
      enabled: true,
      versions: { a: "a", x: "" },
      settings: {
        a: "a",
        b: "b",
      },
    };

    const newSett = {
      conf: { t: "boo", c: "lest", ver: { g: "w", n: "g" } },
      enabled: false,
      versions: [3, 1, 2],
      settings: {
        l: "bla",
        c: "gra",
      },
    };
    const results = mergeAllSettings(oldSett, newSett, ["ver"]);
    expect(results).toEqual({
      conf: { t: "boo", c: "lest", ver: { g: "w", n: "g" }, b: "test" },
      enabled: false,
      versions: [3, 1, 2],
      settings: { l: "bla", c: "gra", a: "a", b: "b" },
    });
  });

  it("should keep old value if key not exists on new object and keysToNotMerge include key", () => {
    const oldSett = {
      conf: { t: "foo", b: "test", ver: { w: "w", d: "g" } },
      enabled: true,
      versions: { a: "a", x: "" },
      settings: {
        a: "a",
        b: "b",
      },
    };

    const newSett = {
      conf: { t: "boo", c: "lest", ver: { g: "w", n: "g" } },
      enabled: false,
      versions: [3, 1, 2],
    };
    const results = mergeAllSettings(oldSett, newSett, ["settings", "ver"]);
    expect(results).toEqual({
      conf: { t: "boo", c: "lest", ver: { g: "w", n: "g" }, b: "test" },
      enabled: false,
      versions: [3, 1, 2],
      settings: { a: "a", b: "b" },
    });
  });
});
