import assert from "assert";
import { shouldUseDarkMode } from "../../preview";

suite("Preview", () => {
  test("Method shouldUseDarkMode", () => {
    assert.strictEqual(shouldUseDarkMode("swaggerui", "light"), false);
    assert.strictEqual(shouldUseDarkMode("swaggerui", "dark"), true);
    assert.strictEqual(shouldUseDarkMode("swaggerui", "highContrast"), true);
    assert.strictEqual(shouldUseDarkMode("swaggerui", "highContrastLight"), false);

    assert.strictEqual(shouldUseDarkMode("redoc", "light"), false);
    assert.strictEqual(shouldUseDarkMode("redoc", "dark"), false);
    assert.strictEqual(shouldUseDarkMode("redoc", "highContrast"), false);
    assert.strictEqual(shouldUseDarkMode("redoc", "highContrastLight"), false);
  });
});
