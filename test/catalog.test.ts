import assert from "node:assert/strict";
import test from "node:test";
import { DeveloperCatalog } from "../src/index.js";

test("normalizes manifests and reports missing environment keys", () => {
  const catalog = new DeveloperCatalog();
  const manifest = catalog.register({
    id: "service.api",
    runtime: "node",
    entrypoint: " dist/index.js ",
    requiredEnv: ["DATABASE_URL", "API_KEY", "DATABASE_URL"],
    capabilities: ["http.api", "health", "http.api"]
  });
  assert.deepEqual(manifest.requiredEnv, ["API_KEY", "DATABASE_URL"]);
  assert.deepEqual(catalog.missingEnvironment("service.api", ["DATABASE_URL"]), ["API_KEY"]);
});

test("filters deterministically by declared capability", () => {
  const catalog = new DeveloperCatalog();
  catalog.register({ id: "z", runtime: "go", entrypoint: "./z", requiredEnv: [], capabilities: ["health"] });
  catalog.register({ id: "a", runtime: "rust", entrypoint: "./a", requiredEnv: [], capabilities: ["health"] });
  assert.deepEqual(catalog.byCapability("health").map((item) => item.id), ["a", "z"]);
});

test("rejects malformed requirements", () => {
  const catalog = new DeveloperCatalog();
  assert.throws(() => catalog.register({ id: "bad id", runtime: "node", entrypoint: "x", requiredEnv: [], capabilities: [] }));
  assert.throws(() => catalog.register({ id: "ok", runtime: "node", entrypoint: "x", requiredEnv: ["bad-key"], capabilities: [] }));
});
