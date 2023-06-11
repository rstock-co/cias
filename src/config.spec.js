import config from "./config";

describe("configuration", () => {
    it("should expose convenient accessors for environment variables we are treating as config", () => {
        console.log("vars: ", config)
        expect(config.ARB_API_KEY_1).toBe("9A86M2SJYUSQS2ZEFP66WC32IW9E19KD39");
    });

    it("should not provide config values that were not setup", () => {
        expect(config.BLAH === undefined).toBeTruthy();
    });
});
